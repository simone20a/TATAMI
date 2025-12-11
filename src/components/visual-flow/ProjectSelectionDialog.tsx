
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Node, Edge } from 'reactflow';
import * as convert from 'xml-js';
import { useToast } from '@/hooks/use-toast';
import { Variable } from './VariablesSheet';

type ProjectSelectionDialogProps = {
  onProjectSelected: (project: {
    name: string;
    initialNodes?: Node[];
    initialEdges?: Edge[];
    initialVariables?: Variable[];
  }) => void;
};

const getEdgeColor = (sourceHandleId: string | null | undefined, defaultColor: string) => {
  if (!sourceHandleId) return defaultColor;
  const typeColors: Record<string, string> = {
    boolean: '#eab308',
    number: '#ef4444',
    address: '#3b82f6',
    string: '#22c55e',
  };
  const type = sourceHandleId.split('-')[0];
  return typeColors[type] || defaultColor;
};

export default function ProjectSelectionDialog({ onProjectSelected }: ProjectSelectionDialogProps) {
  const [mode, setMode] = useState<'initial' | 'new'>('initial');
  const [projectName, setProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        
        onProjectSelected({
          name: file.name.replace('.xml', ''),
          initialNodes: loadedNodes,
          initialEdges: loadedEdges,
          initialVariables: loadedVariables,
        });

      } catch (error) {
        console.error('Failed to parse XML file', error);
        toast({
            title: 'Error',
            description: 'Failed to parse the XML file.',
            variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleCreateProject = () => {
    if (projectName.trim()) {
      onProjectSelected({ name: projectName.trim(), initialNodes: [], initialEdges: [], initialVariables: [] });
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Card className="w-[450px] z-10">
        <CardHeader>
          <CardTitle>Welcome to the Editor</CardTitle>
          <CardDescription>Create a new project or import an existing one to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'initial' && (
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="lg" onClick={() => setMode('new')}>
                Create New Project
              </Button>
              <Button variant="outline" size="lg" onClick={handleImportClick}>
                Import Existing Project
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xml"
              />
            </div>
          )}
          {mode === 'new' && (
             <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateProject();
                }}
              >
              <div className="space-y-4">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter a name for your new project"
                />
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {mode === 'new' && (
            <>
              <Button variant="ghost" onClick={() => setMode('initial')}>
                Back
              </Button>
              <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                Create
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    