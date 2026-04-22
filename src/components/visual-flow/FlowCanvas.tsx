
"use client";

import { useState, useCallback, MouseEvent as ReactMouseEvent, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
  ReactFlowInstance,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as convert from 'xml-js';

import { nodeTypes } from './node-types';
import ContextMenu from './ContextMenu';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Trash2, Download, Package, AlertTriangle } from 'lucide-react';
import DocumentationSheet from './DocumentationSheet';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import VariablesSheet, { Variable, globalStateVariables } from './VariablesSheet';
import ErrorValidationSheet, { ValidationError } from './ErrorValidationSheet';

type MenuState = {
  id: string;
  top: number;
  left: number;
  data: any;
} | null;

type ImportedModel = {
  nodes: Node[];
  edges: Edge[];
  variables?: Variable[];
};

let nodeIdCounter = 0;

const typeColors: Record<string, string> = {
  boolean: '#eab308',
  number: '#ef4444',
  address: '#3b82f6',
  string: '#22c55e',
};

const getEdgeColor = (sourceHandleId: string | null | undefined, defaultColor: string) => {
  if (!sourceHandleId) return defaultColor;
  const type = sourceHandleId.split('-')[0];
  return typeColors[type] || defaultColor;
};

const findUpstreamEntryNode = (
  startNodeId: string,
  nodes: Node[],
  edges: Edge[]
): string | null => {
  let currentNodeId: string | null = startNodeId;
  const visited = new Set<string>();

  while (currentNodeId && !visited.has(currentNodeId)) {
    visited.add(currentNodeId);
    const currentNode = nodes.find((n) => n.id === currentNodeId);

    if (!currentNode) {
      return null;
    }

    if (currentNode.type === 'entryNode') {
      return currentNode.id;
    }

    const incomingEdges = edges.filter((e) => e.target === currentNodeId);
    let nextNodeId: string | null = null;

    for (const edge of incomingEdges) {
      if (currentNode.type === 'splitNode' || currentNode.type === 'ifNode') {
        if (edge.targetHandle === 'input-stream') {
          nextNodeId = edge.source;
          break;
        }
      } else {
        nextNodeId = edge.source;
        break;
      }
    }

    currentNodeId = nextNodeId;
  }

  return null;
};

type FlowProps = {
  projectName: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialVariables?: Variable[];
};

const getNodeHandles = (node: Node, allVariables: Variable[], allPools: any[], allTokens: any[], nftData: any[]): { source: string[], target: string[] } => {
  const handles = { source: [] as string[], target: [] as string[] };
  const { type, data } = node;

  switch (type) {
    case 'entryNode':
      (data.tokenSelections || [{ id: 0 }]).forEach((s: any) => {
        handles.source.push(`output-stream-${s.id}`);
        handles.target.push(`number-quantity-${s.id}`);
      });
      break;
    case 'splitNode':
      handles.target.push('input-stream', 'number-branch1', 'number-branch2');
      handles.source.push('output1', 'output2');
      break;
    case 'mintNode':
      handles.target.push('input-stream');
      const tokenInfo = allTokens.find((t: any) => t.name === data.selectedToken);
      if (tokenInfo?.type === 'Fungible') {
        handles.target.push('number-quantity');
      } else if (tokenInfo?.type === 'Non-Fungible') {
        const nft = nftData.find((n: any) => n.name === tokenInfo.name);
        (nft?.attributes || []).forEach((attr: any) => {
          handles.target.push(`${attr.type.toLowerCase()}-${attr.name}-${attr.id}`);
        });
      }
      handles.source.push('output', 'minted-output');
      break;
    case 'burnNode':
      handles.target.push('to-burn');
      break;
    case 'joinNode':
      handles.target.push('input1', 'input2');
      handles.source.push('output');
      break;
    case 'ifNode':
      handles.target.push('input-stream', 'boolean-condition');
      handles.source.push('then', 'else');
      break;
    case 'depositNode':
      handles.target.push('input-stream');
      const depPool = allPools.find((p: any) => p.name === data.selectedPool);
      (depPool?.keys || []).forEach((key: any) => {
        handles.target.push(`${key.type.toLowerCase()}-key-${key.id}`);
      });
      break;
    case 'withdrawNode':
      handles.target.push('input-stream');
      const withPool = allPools.find((p: any) => p.name === data.selectedPool);
      if (withPool) {
        if (withPool.tokenType === 'Non-Fungible') {
          handles.target.push('number-id');
        } else {
          handles.target.push('number-amount');
        }

        (withPool.keys || []).forEach((key: any) => {
          handles.target.push(`${key.type.toLowerCase()}-key-${key.id}`);
        });
      }
      handles.source.push('output-stream', 'withdrawn-stream');
      break;
    case 'transferNode':
      handles.target.push('input-stream', 'address-recipient');
      break;
    case 'setNode':
      handles.target.push('input-stream');
      const variable = allVariables.find((v: any) => v.name === data.selectedVariable);
      if (variable) {
        handles.target.push(`${variable.type.toLowerCase()}-value`);
      }
      handles.source.push('output-stream');
      break;
    case 'exceptionNode':
      handles.target.push('input-stream');
      break;
    case 'booleanNode': handles.source.push('boolean'); break;
    case 'numberNode': handles.source.push('number'); break;
    case 'addressNode': handles.source.push('address'); break;
    case 'stringNode': handles.source.push('string'); break;
  }

  return {
    source: [...new Set(handles.source)],
    target: [...new Set(handles.target)],
  };
};

const Flow = ({ projectName, initialNodes = [], initialEdges = [], initialVariables = [] }: FlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [menu, setMenu] = useState<MenuState>(null);
  const [nodeMenu, setNodeMenu] = useState<MenuState>(null);
  const [edgeMenu, setEdgeMenu] = useState<MenuState>(null);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [importedModel, setImportedModel] = useState<ImportedModel | null>(null);
  const { screenToFlowPosition, getNode, getNodes, getEdges, setViewport } = useReactFlow();
  const { toast } = useToast();

  useEffect(() => {
    const maxId = Math.max(-1, ...nodes.map(n => parseInt(n.id, 10)).filter(id => !isNaN(id)));
    nodeIdCounter = maxId + 1;
  }, [nodes]);

  const onModelImported = () => {
    setImportedModel(null);
  };

  useEffect(() => {
    if (importedModel) {
      setNodes([]);
      setEdges([]);
      setVariables([]);

      setTimeout(() => {
        setNodes(importedModel.nodes);
        setEdges(importedModel.edges);
        setVariables(importedModel.variables || []);
        onModelImported();
        toast({
          title: 'Success',
          description: 'Model imported successfully.',
          variant: 'success',
          duration: 5000,
        });

        if (reactFlowInstance) {
          setTimeout(() => {
            reactFlowInstance.fitView();
          }, 100);
        }
      }, 0);
    }
  }, [importedModel, setNodes, setEdges, toast, reactFlowInstance, setVariables]);

  const isValidConnection = (connection: Connection) => {
    if (connection.source === connection.target) {
      return false;
    }

    const targetHandleHasConnection = edges.some(
      (edge) => edge.target === connection.target && edge.targetHandle === connection.targetHandle
    );

    if (targetHandleHasConnection) {
      return false;
    }

    const sourceHandleType = connection.sourceHandle?.split('-')[0];
    const targetHandleType = connection.targetHandle?.split('-')[0];

    const defaultHandles = ['input', 'output', 'then', 'else', 'to', 'minted', 'withdrawn', 'original', 'stream'];

    const isSourceDefault = defaultHandles.some(h => connection.sourceHandle?.includes(h));
    const isTargetDefault = defaultHandles.some(h => connection.targetHandle?.includes(h));

    if (isSourceDefault && isTargetDefault) {
      const targetNode = getNode(connection.target!);
      if (targetNode?.type === 'joinNode') {
        const otherInputHandle = connection.targetHandle === 'input1' ? 'input2' : 'input1';
        const existingEdge = edges.find(
          (e) => e.target === connection.target && e.targetHandle === otherInputHandle
        );

        if (existingEdge) {
          const entry1 = findUpstreamEntryNode(connection.source!, nodes, edges);
          const entry2 = findUpstreamEntryNode(existingEdge.source, nodes, edges);

          if (entry1 && entry2 && entry1 !== entry2) {
            return false;
          }
        }
      }
      return true;
    }

    return sourceHandleType === targetHandleType;
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const defaultColor = 'hsl(var(--primary))';
      const color = getEdgeColor(params.sourceHandle, defaultColor);
      const isTokenFlow = color === defaultColor;

      const newEdge = {
        ...params,
        animated: isTokenFlow,
        style: { stroke: color, strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  const onPaneContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      if (!position) return;
      setMenu({
        id: 'pane-menu',
        top: event.clientY,
        left: event.clientX,
        data: position,
      });
      setNodeMenu(null);
      setEdgeMenu(null);
    },
    [screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
    setNodeMenu(null);
    setEdgeMenu(null);
  }, []);

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      setNodeMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        data: node,
      });
      setMenu(null);
      setEdgeMenu(null);
    },
    []
  );

  const onEdgeContextMenu = useCallback(
    (event: ReactMouseEvent, edge: Edge) => {
      event.preventDefault();
      setEdgeMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX,
        data: edge,
      });
      setMenu(null);
      setNodeMenu(null);
    },
    []
  );

  const onAddNode = useCallback(
    (type: string) => {
      if (!menu) return;
      const position = menu.data;

      const label = type.replace('Node', '').replace(/([A-Z])/g, ' $1').trim();
      let data: any = { label };
      const newId = `${nodeIdCounter++}`;

      switch (type) {
        case 'booleanNode':
          data = { ...data, value: 'true' };
          break;
        case 'numberNode':
          data = { ...data, value: '0' };
          break;
        case 'addressNode':
          data = { ...data, value: '0x...' };
          break;
        case 'stringNode':
          data = { ...data, value: 'text' };
          break;
        case 'entryNode':
          data = { label: 'Entry', name: `entry${newId}`, tokenSelections: [{ id: 0 }] };
          break;
        case 'splitNode':
          data = { label: 'Split' };
          break;
        case 'mintNode':
          data = { label: 'Mint' };
          break;
        case 'burnNode':
          data = { label: 'Burn' };
          break;
        case 'exceptionNode':
          data = { label: 'Exception' };
          break;
        case 'joinNode':
          data = { label: 'Join' };
          break;
        case 'ifNode':
          data = { label: 'If' };
          break;
        case 'depositNode':
          data = { label: 'Deposit' };
          break;
        case 'withdrawNode':
          data = { label: 'Withdraw' };
          break;
        case 'transferNode':
          data = { label: 'Transfer' };
          break;
        case 'fungibleTokenNode':
          data = { label: 'Fungible Token', name: `MyToken${newId}`, symbol: 'MTK' };
          break;
        case 'nonFungibleTokenNode':
          data = { label: 'Non-Fungible Token', name: `MyNFT${newId}`, attributes: [] };
          break;
        case 'poolNode':
          data = { label: 'Pool', name: `MyPool${newId}`, keys: [] };
          break;
        case 'setNode':
          data = { label: 'Set' };
          break;
        default:
          break;
      }

      const newNode: Node = {
        id: newId,
        type,
        position: position || { x: 0, y: 0 },
        data,
      };
      setNodes((nds) => nds.concat(newNode));
      setMenu(null);
    },
    [menu, setNodes]
  );

  const onDeleteNode = useCallback(() => {
    if (!nodeMenu) return;
    setNodes((nds) => nds.filter((n) => n.id !== nodeMenu.id));
    setEdges((eds) => eds.filter((e) => e.source !== nodeMenu.id && e.target !== nodeMenu.id));
    setNodeMenu(null);
  }, [nodeMenu, setNodes, setEdges]);

  const onDeleteEdge = useCallback(() => {
    if (!edgeMenu) return;
    setEdges((eds) => eds.filter((e) => e.id !== edgeMenu.id));
    setEdgeMenu(null);
  }, [edgeMenu, setEdges]);

  const onExport = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    const modelObject = {
      _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
      model: {
        nodes: {
          node: currentNodes.map(node => ({
            _attributes: {
              id: node.id,
              type: node.type,
              x: node.position.x,
              y: node.position.y,
            },
            data: {
              _cdata: JSON.stringify(node.data),
            }
          }))
        },
        edges: {
          edge: currentEdges.map(edge => ({
            _attributes: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              sourceHandle: edge.sourceHandle,
              targetHandle: edge.targetHandle,
            }
          }))
        },
        variables: {
          variable: variables.map(variable => ({
            _attributes: {
              id: variable.id,
              name: variable.name,
              type: variable.type,
              scope: variable.scope,
              ...(variable.value && { value: variable.value }),
              ...(variable.metadata && { metadata: JSON.stringify(variable.metadata) }),
            }
          }))
        }
      }
    };

    const xml = convert.js2xml(modelObject, { compact: true, spaces: 4 });

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getNodes, getEdges, projectName, variables]);

  const fungibleTokenNodes = useMemo(() =>
    nodes.filter(node => node.type === 'fungibleTokenNode' && node.data.name && node.data.name.trim() !== ''),
    [nodes]
  );

  const nonFungibleTokens = useMemo(() =>
    nodes.filter(node => node.type === 'nonFungibleTokenNode' && node.data.name && node.data.name.trim() !== ''),
    [nodes]
  );

  const allTokens = useMemo(() => {
    const ftData = fungibleTokenNodes.map(node => ({ name: node.data.name, type: 'Fungible' as const }));
    const nftData = nonFungibleTokens.map(node => ({ name: node.data.name, type: 'Non-Fungible' as const }));
    return [...ftData, ...nftData].filter(t => t.name && t.name.trim() !== '');
  }, [fungibleTokenNodes, nonFungibleTokens]);

  const poolNodes = useMemo(() =>
    nodes.filter(node => node.type === 'poolNode' && node.data.name && node.data.name.trim() !== ''),
    [nodes]
  );

  useEffect(() => {
    const stateVarsFromFungibleTokens = fungibleTokenNodes.flatMap(ftNode => ([
      {
        id: `state-var-ts-${ftNode.id}`,
        name: `${ftNode.data.name}_TotalSupply`,
        type: 'Number' as const,
        scope: 'state' as const,
        isDeletable: false,
      },
      {
        id: `state-var-bof-${ftNode.id}`,
        name: `${ftNode.data.name}_balanceOf`,
        type: 'Number' as const,
        scope: 'state' as const,
        isDeletable: false,
        metadata: { inputType: 'Address' }
      }
    ]));

    const stateVarsFromNonFungibleTokens = nonFungibleTokens.flatMap(nftNode => {
      const attributes = nftNode.data.attributes || [];
      return attributes.map((attr: any) => ({
        id: `state-var-attr-${nftNode.id}-${attr.id}`,
        name: `${nftNode.data.name}_${attr.name}`,
        type: attr.type,
        scope: 'state' as const,
        isDeletable: false,
        metadata: { inputType: 'Number' } // Token ID is Number
      }));
    });

    const stateVarsFromPools = poolNodes.flatMap(pNode => {
      return [{
        id: `state-var-amount-${pNode.id}`,
        name: `${pNode.data.name}_amount`,
        type: 'Number' as const,
        scope: 'state' as const,
        isDeletable: false,
      }];
    });

    setVariables(vars => {
      const userVars = vars.filter(v => v.scope !== 'state');
      const nodeBasedStateVars = [
        ...stateVarsFromFungibleTokens,
        ...stateVarsFromNonFungibleTokens,
        ...stateVarsFromPools
      ];

      // Filter out old state variables that no longer have a corresponding node
      const allNodeIds = nodes.map(n => n.id);
      const filteredUserVars = userVars.filter(v => {
        const varNodeId = v.id.split('-').pop();
        if (v.id.startsWith('state-var-') && !allNodeIds.includes(varNodeId!)) {
          return false;
        }
        return true;
      });

      const currentGlobalVars = vars.filter(v => v.id.startsWith('global-'));
      const newGlobalVars = globalStateVariables.filter(gv => !currentGlobalVars.some(cv => cv.id === gv.id));

      return [...currentGlobalVars, ...newGlobalVars, ...filteredUserVars, ...nodeBasedStateVars];
    });
  }, [fungibleTokenNodes, nonFungibleTokens, poolNodes, setVariables, nodes]);

  const pools = useMemo(() => poolNodes.map(node => {
    const tokenInfo = allTokens.find(t => t.name === node.data.selectedToken);
    return { ...node.data, tokenType: tokenInfo?.type };
  }).filter(p => p.name && p.name.trim() !== ''), [poolNodes, allTokens]);

  const mutableVariables = useMemo(() =>
    variables.filter(v => v.scope === 'variable'),
    [variables]
  );

  const runValidation = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    const currentVars = variables;
    const errors: ValidationError[] = [];

    const connectedHandles = new Set<string>();
    currentEdges.forEach(edge => {
      if (edge.sourceHandle) {
        connectedHandles.add(`${edge.source}-${edge.sourceHandle}`);
      }
      if (edge.targetHandle) {
        connectedHandles.add(`${edge.target}-${edge.targetHandle}`);
      }
    });

    const allPoolsData = currentNodes.filter(n => n.type === 'poolNode').map(n => {
      const tokenInfo = allTokens.find(t => t.name === n.data.selectedToken);
      return { ...n.data, tokenType: tokenInfo?.type };
    });

    const allTokensData = currentNodes
      .filter(n => n.type === 'fungibleTokenNode' || n.type === 'nonFungibleTokenNode')
      .map(n => ({ name: n.data.name, type: n.type === 'fungibleTokenNode' ? 'Fungible' : 'Non-Fungible' }));
    const nftData = currentNodes.filter(n => n.type === 'nonFungibleTokenNode').map(n => n.data);

    currentNodes.forEach(node => {
      if (node.type && ['fungibleTokenNode', 'nonFungibleTokenNode', 'poolNode'].includes(node.type)) {
        return;
      }

      const expectedHandles = getNodeHandles(node, currentVars, allPoolsData, allTokensData, nftData);

      expectedHandles.source.forEach(handleId => {
        if (!connectedHandles.has(`${node.id}-${handleId}`)) {
          errors.push({ id: `unconnected-source-${node.id}-${handleId}`, message: `Node "${node.data.label || node.type}" (${node.id}) has an unconnected output.` });
        }
      });

      expectedHandles.target.forEach(handleId => {
        if (!connectedHandles.has(`${node.id}-${handleId}`)) {
          errors.push({ id: `unconnected-target-${node.id}-${handleId}`, message: `Node "${node.data.label || node.type}" (${node.id}) has an unconnected input.` });
        }
      });
    });

    const adjList: { [key: string]: string[] } = {};
    currentEdges.forEach(edge => {
      if (!adjList[edge.source]) adjList[edge.source] = [];
      adjList[edge.source].push(edge.target);
    });

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(nodeId: string): boolean {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjList[nodeId] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }
      recursionStack.delete(nodeId);
      return false;
    }

    for (const node of currentNodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          errors.push({ id: `loop-${node.id}`, message: `A cyclical dependency (loop) was detected involving node "${node.data.label || node.type}" (${node.id}).` });
          break;
        }
      }
    }

    currentNodes.forEach(node => {
      if (node.type === 'entryNode') {
        (node.data.tokenSelections || []).forEach((sel: any) => {
          if (!sel.selectedToken) {
            errors.push({ id: `dropdown-${node.id}-${sel.id}`, message: `Node "Entry" (${node.id}) has an unselected token.` });
          }
        });
      }
      if (node.type === 'mintNode' && !node.data.selectedToken) {
        errors.push({ id: `dropdown-${node.id}`, message: `Node "${node.data.label}" (${node.id}) has no Token selected.` });
      }
      if (node.type === 'poolNode' && !node.data.selectedToken) {
        errors.push({ id: `dropdown-${node.id}`, message: `Node "${node.data.label}" (${node.id}) has no Token selected.` });
      }
      if ((node.type === 'depositNode' || node.type === 'withdrawNode') && !node.data.selectedPool) {
        errors.push({ id: `dropdown-${node.id}`, message: `Node "${node.data.label}" (${node.id}) has no Pool selected.` });
      }
      if (node.type === 'setNode' && !node.data.selectedVariable) {
        errors.push({ id: `dropdown-${node.id}`, message: `Node "${node.data.label}" (${node.id}) has no Variable selected.` });
      }
    });

    const allVarNames = new Set(currentVars.map(v => v.name.split('(')[0]));
    currentNodes.forEach(node => {
      if (node.type?.endsWith('Node') && ['booleanNode', 'numberNode', 'addressNode', 'stringNode'].includes(node.type) && node.data.value) {
        const value = node.data.value as string;
        // Updated regex to better capture potential variable names, ignoring numbers and quoted strings.
        const potentialVars = value.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

        potentialVars.forEach(potentialVar => {
          if (['true', 'false'].includes(potentialVar) || !isNaN(parseFloat(potentialVar))) {
            return;
          }
          const varName = potentialVar.split('(')[0];
          if (!allVarNames.has(varName)) {
            errors.push({ id: `undef-var-${node.id}-${varName}`, message: `Node "${node.data.label}" (${node.id}) references an undefined variable: "${varName}".` });
          }
        });
      }
    });

    setValidationErrors(errors);
  }, [getNodes, getEdges, variables, allTokens]);

  useEffect(() => {
    runValidation();
  }, [nodes, edges, variables, runValidation]);

  const nodesWithDynamicData = useMemo(() => {
    const nftDataForMint = getNodes()
      .filter(n => n.type === 'nonFungibleTokenNode')
      .map(n => n.data);

    const allTokensFiltered = allTokens.filter(t => t.name && t.name.trim() !== '');

    return nodes.map(node => {
      if (node.type === 'poolNode') {
        return {
          ...node,
          data: {
            ...node.data,
            allTokens: allTokensFiltered,
          }
        };
      }
      if (node.type === 'depositNode' || node.type === 'withdrawNode') {
        return {
          ...node,
          data: {
            ...node.data,
            pools: pools,
          }
        };
      }
      if (node.type === 'entryNode') {
        return {
          ...node,
          data: {
            ...node.data,
            tokens: allTokensFiltered.map(t => ({ name: t.name, type: t.type })),
          }
        };
      }
      if (node.type === 'mintNode') {
        return {
          ...node,
          data: {
            ...node.data,
            allTokens: allTokensFiltered,
            nftData: nftDataForMint,
          }
        };
      }
      if (node.type === 'setNode') {
        return {
          ...node,
          data: {
            ...node.data,
            variables: variables.filter(v => v.scope === 'variable'),
          }
        }
      }
      return node;
    })
  }, [nodes, allTokens, pools, variables, getNodes]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const xml = e.target?.result as string;
        const result = convert.xml2js(xml, { compact: true });
        const model = (result as any).model;

        const nodesArray = model.nodes && model.nodes.node ? (Array.isArray(model.nodes.node) ? model.nodes.node : [model.nodes.node]) : [];
        const loadedNodes: Node[] = nodesArray.map((n: any) => {
          const data = n.data && n.data._cdata ? JSON.parse(n.data._cdata) : {};
          return {
            id: n._attributes.id,
            type: n._attributes.type,
            position: { x: parseFloat(n._attributes.x), y: parseFloat(n._attributes.y) },
            data: data,
          };
        });

        const edgesArray = model.edges && model.edges.edge ? (Array.isArray(model.edges.edge) ? model.edges.edge : [model.edges.edge]) : [];
        const loadedEdges: Edge[] = edgesArray.map((e: any) => {
          const color = getEdgeColor(e._attributes.sourceHandle, 'hsl(var(--primary))');
          const isTokenFlow = color === 'hsl(var(--primary))';
          return {
            id: e._attributes.id,
            source: e._attributes.source,
            target: e._attributes.target,
            sourceHandle: e._attributes.sourceHandle,
            targetHandle: e._attributes.targetHandle,
            animated: isTokenFlow,
            style: { stroke: color, strokeWidth: 2 },
          };
        });

        const variablesArray = model.variables && model.variables.variable ? (Array.isArray(model.variables.variable) ? model.variables.variable : [model.variables.variable]) : [];
        const loadedVariables: Variable[] = variablesArray.map((v: any) => {
          const scope = v._attributes.scope;
          return {
            id: v._attributes.id,
            name: v._attributes.name,
            type: v._attributes.type,
            scope: scope,
            value: v._attributes.value,
            isDeletable: scope !== 'state',
            metadata: v._attributes.metadata ? JSON.parse(v._attributes.metadata) : undefined,
          }
        });

        setImportedModel({ nodes: loadedNodes, edges: loadedEdges, variables: loadedVariables });

      } catch (error) {
        console.error('Failed to parse XML file', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const validateModel = () => {
    setIsValidationOpen(true);
  }

  return (
    <div className="h-full w-full relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xml"
      />
      <div className="absolute top-4 left-4 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsVariablesOpen(true)}
            >
              <Package className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>State</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsDocOpen(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm"
              onClick={onExport}
            >
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm"
                onClick={validateModel}
              >
                <AlertTriangle className="h-5 w-5" />
              </Button>
              {validationErrors.length > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                  {validationErrors.length}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Validate</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <DocumentationSheet open={isDocOpen} onOpenChange={setIsDocOpen} />
      <VariablesSheet
        open={isVariablesOpen}
        onOpenChange={setIsVariablesOpen}
        variables={variables}
        setVariables={setVariables}
      />
      <ErrorValidationSheet
        open={isValidationOpen}
        onOpenChange={setIsValidationOpen}
        errors={validationErrors}
      />
      {nodes.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none">
          Right-Click to add a Block
        </div>
      )}
      <ReactFlow
        nodes={nodesWithDynamicData}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes as NodeTypes}
        isValidConnection={isValidConnection}
        onInit={setReactFlowInstance}
        fitView
        className="bg-background"
        deleteKeyCode={null}
      >
        <Controls />
        <Background gap={24} color="hsl(var(--border))" variant="dots" />
        {menu && <ContextMenu
          onClick={onAddNode}
          top={menu.top}
          left={menu.left}
        />}
        {nodeMenu && (
          <div style={{ top: nodeMenu.top, left: nodeMenu.left }} className="absolute z-50">
            <Card className="w-40 bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
              <CardContent className="p-1">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDeleteNode}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        {edgeMenu && (
          <div style={{ top: edgeMenu.top, left: edgeMenu.left }} className="absolute z-50">
            <Card className="w-40 bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
              <CardContent className="p-1">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDeleteEdge}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </ReactFlow>
    </div>
  );
};

type FlowCanvasProps = {
  projectName: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialVariables?: Variable[];
};

const FlowCanvas = ({ projectName, initialNodes, initialEdges, initialVariables }: FlowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <TooltipProvider>
        <Flow
          projectName={projectName}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          initialVariables={initialVariables}
        />
      </TooltipProvider>
    </ReactFlowProvider>
  );
};


export default FlowCanvas;











