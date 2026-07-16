/**
 * Additional model validation checks, not present in the original
 * runValidation/isValidConnection logic in FlowCanvas.tsx. These are ported
 * 1:1 (same logic, same English messages) from the standalone
 * `tatami-validator-cli` project (kept outside this repo), where they were
 * implemented and tested first against TATAMI/examples/*.xml and a set of
 * stress-test models. See that project's README for the rationale behind
 * each check. Kept in sync with tatami-validator-cli/src/validator.ts and
 * tokenFlow.ts — any check added/changed there should be mirrored here.
 *
 * Checks added here:
 *  - Join combining token flows from two different Entry nodes (already
 *    enforced by isValidConnection only while drawing a new edge; here it is
 *    re-applied statically to the whole graph, so it also catches indirect
 *    changes such as deleting/rewiring the upstream Entry after the Join was
 *    created, or models imported from XML).
 *  - Dangling edges (source/target pointing to a node id that no longer
 *    exists).
 *  - Dangling references (selectedToken/selectedPool/selectedVariable that
 *    are set but no longer match any existing token/pool/variable).
 *  - Duplicate names among tokens, pools, or variables.
 *  - Generalized handle type-mismatch, re-checked on every edge already
 *    present in the graph (isValidConnection only checks this once, at the
 *    moment the edge is drawn).
 *  - Single edge per output: at most one edge can leave a given source
 *    handle, without exceptions (literal "type block" nodes included).
 *  - Single edge per input: at most one edge can reach a given target
 *    handle, without exceptions (symmetric to the previous check).
 *  - Join combining two flows that carry different tokens (by identity, not
 *    just by originating Entry).
 *  - Join or Split applied to a Non-Fungible token flow.
 */
import { Node, Edge } from 'reactflow';
import { Variable } from './VariablesSheet';
import { ValidationError } from './ErrorValidationSheet';

type TokenKind = 'Fungible' | 'Non-Fungible';

interface TokenInfo {
  tokenName: string;
  tokenKind: TokenKind;
}

/**
 * Walks the graph backwards along the "main" incoming edge (for splitNode/
 * ifNode only the one on 'input-stream') until it reaches an entryNode.
 * Duplicated from the local findUpstreamEntryNode in FlowCanvas.tsx to avoid
 * a circular import between the two files; kept logically identical.
 */
function findUpstreamEntryNode(startNodeId: string, nodes: Node[], edges: Edge[]): string | null {
  let currentNodeId: string | null = startNodeId;
  const visited = new Set<string>();

  while (currentNodeId && !visited.has(currentNodeId)) {
    visited.add(currentNodeId);
    const currentNode = nodes.find((n) => n.id === currentNodeId);
    if (!currentNode) return null;
    if (currentNode.type === 'entryNode') return currentNode.id;

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
}

function buildTokenKindMap(nodes: Node[]): Map<string, TokenKind> {
  const map = new Map<string, TokenKind>();
  nodes.forEach((n) => {
    if (n.type === 'fungibleTokenNode' && n.data?.name) {
      map.set(n.data.name, 'Fungible');
    } else if (n.type === 'nonFungibleTokenNode' && n.data?.name) {
      map.set(n.data.name, 'Non-Fungible');
    }
  });
  return map;
}

function buildPoolTokenMap(nodes: Node[]): Map<string, string> {
  const map = new Map<string, string>();
  nodes.forEach((n) => {
    if (n.type === 'poolNode' && n.data?.name && n.data?.selectedToken) {
      map.set(n.data.name, n.data.selectedToken);
    }
  });
  return map;
}

/**
 * Walks the graph backwards from a "stream" source handle to determine which
 * token (name + kind) actually flows through it. Returns null when it
 * cannot be determined (incomplete configuration, terminal node with no
 * stream output, or a cycle — all already reported by other checks).
 */
function resolveTokenForSourceHandle(
  nodeId: string,
  handleId: string | null | undefined,
  nodes: Node[],
  edges: Edge[],
  tokenKindOf: Map<string, TokenKind>,
  poolTokenOf: Map<string, string>,
  visited: Set<string> = new Set()
): TokenInfo | null {
  if (!handleId) return null;
  const visitKey = `${nodeId}:${handleId}`;
  if (visited.has(visitKey)) return null;
  visited.add(visitKey);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const findIncoming = (targetHandle: string) =>
    edges.find((e) => e.target === nodeId && e.targetHandle === targetHandle);

  const recurse = (edge: Edge | undefined): TokenInfo | null =>
    edge
      ? resolveTokenForSourceHandle(edge.source, edge.sourceHandle, nodes, edges, tokenKindOf, poolTokenOf, visited)
      : null;

  switch (node.type) {
    case 'entryNode': {
      const selId = handleId.replace('output-stream-', '');
      const sel = (node.data.tokenSelections || []).find((s: any) => String(s.id) === selId);
      const tokenName = sel?.selectedToken;
      if (!tokenName) return null;
      const tokenKind = tokenKindOf.get(tokenName);
      return tokenKind ? { tokenName, tokenKind } : null;
    }
    case 'mintNode': {
      const tokenName = node.data.selectedToken;
      if (!tokenName) return null;
      const tokenKind = tokenKindOf.get(tokenName);
      return tokenKind ? { tokenName, tokenKind } : null;
    }
    case 'withdrawNode': {
      const poolName = node.data.selectedPool;
      const tokenName = poolName ? poolTokenOf.get(poolName) : undefined;
      if (!tokenName) return null;
      const tokenKind = tokenKindOf.get(tokenName);
      return tokenKind ? { tokenName, tokenKind } : null;
    }
    case 'splitNode':
    case 'ifNode':
    case 'setNode':
      return recurse(findIncoming('input-stream'));
    case 'joinNode': {
      const fromInput1 = recurse(findIncoming('input1'));
      if (fromInput1) return fromInput1;
      return recurse(findIncoming('input2'));
    }
    default:
      return null;
  }
}

/** Join combining token flows originating from two different Entry nodes. */
export function checkJoinFromDifferentEntries(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  nodes
    .filter((n) => n.type === 'joinNode')
    .forEach((joinNode) => {
      const edge1 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input1');
      const edge2 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input2');
      if (!edge1 || !edge2) return; // unconnected handle: already reported elsewhere

      const entry1 = findUpstreamEntryNode(edge1.source, nodes, edges);
      const entry2 = findUpstreamEntryNode(edge2.source, nodes, edges);

      if (entry1 && entry2 && entry1 !== entry2) {
        errors.push({
          id: `join-conflict-${joinNode.id}`,
          message: `Node "${joinNode.data?.label || 'Join'}" (${joinNode.id}) combines token flows originating from two different Entry nodes ("${entry1}" and "${entry2}").`,
        });
      }
    });

  return errors;
}

/** Edges whose source and/or target do not match any node id in the graph. */
export function checkDanglingEdges(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source)) {
      errors.push({
        id: `dangling-edge-source-${edge.id}`,
        message: `Edge "${edge.id}" references a source node that does not exist: "${edge.source}".`,
      });
    }
    if (!nodeIds.has(edge.target)) {
      errors.push({
        id: `dangling-edge-target-${edge.id}`,
        message: `Edge "${edge.id}" references a target node that does not exist: "${edge.target}".`,
      });
    }
  });

  return errors;
}

/**
 * selectedToken/selectedPool/selectedVariable that are not empty (that case
 * is already reported by the existing dropdown checks) but point to a name
 * that does not match any token/pool/variable actually defined in the model
 * — typically because the referenced node was renamed or deleted afterwards.
 */
export function checkDanglingReferences(nodes: Node[], variables: Variable[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const isNonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

  const tokenNames = new Set(
    nodes
      .filter((n) => n.type === 'fungibleTokenNode' || n.type === 'nonFungibleTokenNode')
      .map((n) => n.data?.name)
      .filter(isNonEmpty)
  );
  const poolNames = new Set(
    nodes
      .filter((n) => n.type === 'poolNode')
      .map((n) => n.data?.name)
      .filter(isNonEmpty)
  );
  const variableNames = new Set(variables.map((v) => v.name));

  nodes.forEach((node) => {
    if (node.type === 'entryNode') {
      (node.data.tokenSelections || []).forEach((sel: any) => {
        if (sel.selectedToken && !tokenNames.has(sel.selectedToken)) {
          errors.push({
            id: `dangling-token-ref-${node.id}-${sel.id}`,
            message: `Node "Entry" (${node.id}) references a token that does not exist: "${sel.selectedToken}".`,
          });
        }
      });
    }
    if (
      (node.type === 'mintNode' || node.type === 'poolNode') &&
      node.data.selectedToken &&
      !tokenNames.has(node.data.selectedToken)
    ) {
      errors.push({
        id: `dangling-token-ref-${node.id}`,
        message: `Node "${node.data.label || node.type}" (${node.id}) references a token that does not exist: "${node.data.selectedToken}".`,
      });
    }
    if (
      (node.type === 'depositNode' || node.type === 'withdrawNode') &&
      node.data.selectedPool &&
      !poolNames.has(node.data.selectedPool)
    ) {
      errors.push({
        id: `dangling-pool-ref-${node.id}`,
        message: `Node "${node.data.label || node.type}" (${node.id}) references a pool that does not exist: "${node.data.selectedPool}".`,
      });
    }
    if (node.type === 'setNode' && node.data.selectedVariable && !variableNames.has(node.data.selectedVariable)) {
      errors.push({
        id: `dangling-var-ref-${node.id}`,
        message: `Node "${node.data.label || node.type}" (${node.id}) references a variable that does not exist: "${node.data.selectedVariable}".`,
      });
    }
  });

  return errors;
}

/**
 * Duplicate names among tokens (Fungible and Non-Fungible share the same
 * namespace, since both end up in the same "allTokens" list used by the
 * selection dropdowns), among pools, and among variables. A duplicate name
 * makes any by-name reference ambiguous (selectedToken/selectedPool/
 * selectedVariable, or the regex in the undefined-variable check), since it
 * is no longer possible to tell which node it actually points to.
 */
export function checkDuplicateNames(nodes: Node[], variables: Variable[]): ValidationError[] {
  const errors: ValidationError[] = [];

  function findDuplicates(items: { id: string; name: unknown }[], kind: string, idPrefix: string) {
    const seen = new Map<string, string[]>();
    items.forEach((item) => {
      if (typeof item.name !== 'string' || item.name.trim() === '') return;
      const ids = seen.get(item.name) || [];
      ids.push(item.id);
      seen.set(item.name, ids);
    });
    seen.forEach((ids, name) => {
      if (ids.length > 1) {
        errors.push({
          id: `${idPrefix}-${name}`,
          message: `Duplicate ${kind} name "${name}" is used by ${ids.length} nodes (${ids.join(', ')}).`,
        });
      }
    });
  }

  findDuplicates(
    nodes
      .filter((n) => n.type === 'fungibleTokenNode' || n.type === 'nonFungibleTokenNode')
      .map((n) => ({ id: n.id, name: n.data?.name })),
    'token',
    'duplicate-token-name'
  );

  findDuplicates(
    nodes.filter((n) => n.type === 'poolNode').map((n) => ({ id: n.id, name: n.data?.name })),
    'pool',
    'duplicate-pool-name'
  );

  findDuplicates(
    variables.map((v) => ({ id: v.id, name: v.name })),
    'variable',
    'duplicate-variable-name'
  );

  return errors;
}

/**
 * Generalizes to every edge already present in the graph the same handle
 * type comparison that isValidConnection only performs at the instant an
 * edge is drawn by hand (1:1 port of the prefix/"default handles" logic in
 * FlowCanvas.tsx's isValidConnection). A model imported from XML, or one
 * whose upstream nodes changed type after the edge was drawn, is never
 * re-checked on this.
 */
const DEFAULT_HANDLE_KEYWORDS = ['input', 'output', 'then', 'else', 'to', 'minted', 'withdrawn', 'original', 'stream'];

export function checkEdgeTypeMismatch(edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  edges.forEach((edge) => {
    if (!edge.sourceHandle || !edge.targetHandle) return;

    const sourceHandleType = edge.sourceHandle.split('-')[0];
    const targetHandleType = edge.targetHandle.split('-')[0];

    const isSourceDefault = DEFAULT_HANDLE_KEYWORDS.some((h) => edge.sourceHandle!.includes(h));
    const isTargetDefault = DEFAULT_HANDLE_KEYWORDS.some((h) => edge.targetHandle!.includes(h));

    // Same rule as isValidConnection: if both handles fall into the
    // "default" category (generic stream/input/output connections), the
    // prefix comparison is skipped — the editor always accepts that pair.
    if (isSourceDefault && isTargetDefault) return;

    if (sourceHandleType !== targetHandleType) {
      errors.push({
        id: `type-mismatch-${edge.id}`,
        message: `Edge "${edge.id}" connects incompatible handle types: "${edge.sourceHandle}" (${sourceHandleType}) -> "${edge.targetHandle}" (${targetHandleType}).`,
      });
    }
  });

  return errors;
}

/**
 * Join combining two flows that carry different tokens (by identity, not
 * just by originating Entry). Stricter than checkJoinFromDifferentEntries:
 * two different Entry nodes could in principle supply the same token, while
 * this check flags the case where the two TOKENS THEMSELVES ARE DIFFERENT,
 * which is never verified anywhere — neither by the editor nor by the
 * symbolic executor's joinNode block, which on a mismatch simply picks the
 * tokenName of whichever input is available and sums the two values anyway.
 */
export function checkJoinTokenMismatch(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const tokenKindOf = buildTokenKindMap(nodes);
  const poolTokenOf = buildPoolTokenMap(nodes);

  nodes
    .filter((n) => n.type === 'joinNode')
    .forEach((joinNode) => {
      const edge1 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input1');
      const edge2 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input2');
      if (!edge1 || !edge2) return; // unconnected handle: already reported elsewhere

      const token1 = resolveTokenForSourceHandle(edge1.source, edge1.sourceHandle, nodes, edges, tokenKindOf, poolTokenOf);
      const token2 = resolveTokenForSourceHandle(edge2.source, edge2.sourceHandle, nodes, edges, tokenKindOf, poolTokenOf);

      if (token1 && token2 && token1.tokenName !== token2.tokenName) {
        errors.push({
          id: `join-token-mismatch-${joinNode.id}`,
          message: `Node "${joinNode.data?.label || 'Join'}" (${joinNode.id}) combines two token flows carrying different tokens: "${token1.tokenName}" and "${token2.tokenName}".`,
        });
      }
    });

  return errors;
}

/**
 * Join or Split applied to a Non-Fungible token flow. Both nodes operate on
 * FUNGIBLE quantities (Join sums two values, Split divides one value by a
 * branch1:branch2 ratio), while a Non-Fungible token is identified by a
 * single id, not by an amount that can be summed or split by ratio.
 */
export function checkNFTJoinSplit(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const tokenKindOf = buildTokenKindMap(nodes);
  const poolTokenOf = buildPoolTokenMap(nodes);

  nodes
    .filter((n) => n.type === 'joinNode')
    .forEach((joinNode) => {
      const edge1 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input1');
      const edge2 = edges.find((e) => e.target === joinNode.id && e.targetHandle === 'input2');

      const tokens = [edge1, edge2]
        .filter((e): e is Edge => !!e)
        .map((e) => resolveTokenForSourceHandle(e.source, e.sourceHandle, nodes, edges, tokenKindOf, poolTokenOf))
        .filter((t): t is TokenInfo => !!t);

      const nft = tokens.find((t) => t.tokenKind === 'Non-Fungible');
      if (nft) {
        errors.push({
          id: `join-nft-${joinNode.id}`,
          message: `Node "${joinNode.data?.label || 'Join'}" (${joinNode.id}) joins a Non-Fungible token flow ("${nft.tokenName}"): merging quantities is only meaningful for Fungible tokens.`,
        });
      }
    });

  nodes
    .filter((n) => n.type === 'splitNode')
    .forEach((splitNode) => {
      const edge = edges.find((e) => e.target === splitNode.id && e.targetHandle === 'input-stream');
      if (!edge) return; // unconnected input-stream: already reported elsewhere

      const token = resolveTokenForSourceHandle(edge.source, edge.sourceHandle, nodes, edges, tokenKindOf, poolTokenOf);
      if (token && token.tokenKind === 'Non-Fungible') {
        errors.push({
          id: `split-nft-${splitNode.id}`,
          message: `Node "${splitNode.data?.label || 'Split'}" (${splitNode.id}) splits a Non-Fungible token flow ("${token.tokenName}"): splitting by ratio is only meaningful for Fungible tokens.`,
        });
      }
    });

  return errors;
}

/**
 * From a single output (source handle), at most ONE edge can come out,
 * without exceptions. Literal nodes (numberNode, booleanNode, addressNode,
 * stringNode) used to be excluded here, since their handles carry a plain
 * value rather than a token stream — that exception has been removed on
 * explicit request: every node type ("type blocks" included) must follow the
 * same rule as every other ("flow blocks"), one edge per output. If the same
 * value is needed in more than one place in the model, the literal node must
 * be duplicated, not shared across multiple edges from a single handle.
 */
export function checkSingleEdgePerOutput(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const grouped = new Map<string, Edge[]>();
  edges.forEach((edge) => {
    if (!edge.sourceHandle) return;
    const key = `${edge.source}::${edge.sourceHandle}`;
    const list = grouped.get(key) || [];
    list.push(edge);
    grouped.set(key, list);
  });

  grouped.forEach((edgeList) => {
    if (edgeList.length > 1) {
      const sample = edgeList[0];
      const node = nodes.find((n) => n.id === sample.source);
      errors.push({
        id: `multi-stream-output-${sample.source}-${sample.sourceHandle}`,
        message: `Node "${node?.data?.label || node?.type || sample.source}" (${sample.source}) feeds ${edgeList.length} edges from a single output ("${sample.sourceHandle}"): each output can feed only one edge.`,
      });
    }
  });

  return errors;
}

/**
 * Symmetric to checkSingleEdgePerOutput, but on inputs: a single target
 * handle can receive at most ONE incoming edge, without exceptions (applies
 * to both "flow blocks" and "type blocks"). An input receiving two values/
 * streams at once would have no unambiguous meaning: which of the two should
 * actually reach the node?
 */
export function checkSingleEdgePerInput(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const grouped = new Map<string, Edge[]>();
  edges.forEach((edge) => {
    if (!edge.targetHandle) return;
    const key = `${edge.target}::${edge.targetHandle}`;
    const list = grouped.get(key) || [];
    list.push(edge);
    grouped.set(key, list);
  });

  grouped.forEach((edgeList) => {
    if (edgeList.length > 1) {
      const sample = edgeList[0];
      const node = nodes.find((n) => n.id === sample.target);
      errors.push({
        id: `multi-edge-input-${sample.target}-${sample.targetHandle}`,
        message: `Node "${node?.data?.label || node?.type || sample.target}" (${sample.target}) receives ${edgeList.length} edges into a single input ("${sample.targetHandle}"): each input can receive only one edge.`,
      });
    }
  });

  return errors;
}

/** Runs every additional check and returns the combined list of errors. */
export function runExtraValidation(nodes: Node[], edges: Edge[], variables: Variable[]): ValidationError[] {
  return [
    ...checkJoinFromDifferentEntries(nodes, edges),
    ...checkDanglingEdges(nodes, edges),
    ...checkDanglingReferences(nodes, variables),
    ...checkDuplicateNames(nodes, variables),
    ...checkEdgeTypeMismatch(edges),
    ...checkSingleEdgePerOutput(nodes, edges),
    ...checkSingleEdgePerInput(nodes, edges),
    ...checkJoinTokenMismatch(nodes, edges),
    ...checkNFTJoinSplit(nodes, edges),
  ];
}
