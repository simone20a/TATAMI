import { Node, Edge } from 'reactflow';
import BooleanNode from './types/BooleanNode';
import NumberNode from './types/NumberNode';
import AddressNode from './types/AddressNode';
import StringNode from './types/StringNode';
import SplitNode from './SplitNode';
import MintNode from './MintNode';
import BurnNode from './BurnNode';
import JoinNode from './JoinNode';
import IfNode from './IfNode';
import DepositNode from './DepositNode';
import FungibleTokenNode from './FungibleTokenNode';
import NonFungibleTokenNode from './NonFungibleTokenNode';
import PoolNode from './PoolNode';
import WithdrawNode from './WithdrawNode';
import TransferNode from './TransferNode';
import EntryNode from './EntryNode';
import ExceptionNode from './ExceptionNode';
import SetNode from './SetNode';
import CommentNode from './CommentNode';

export const nodeTypes = {
  booleanNode: BooleanNode,
  numberNode: NumberNode,
  addressNode: AddressNode,
  stringNode: StringNode,
  entryNode: EntryNode,
  splitNode: SplitNode,
  mintNode: MintNode,
  burnNode: BurnNode,
  joinNode: JoinNode,
  ifNode: IfNode,
  depositNode: DepositNode,
  fungibleTokenNode: FungibleTokenNode,
  nonFungibleTokenNode: NonFungibleTokenNode,
  poolNode: PoolNode,
  withdrawNode: WithdrawNode,
  transferNode: TransferNode,
  exceptionNode: ExceptionNode,
  setNode: SetNode,
  commentNode: CommentNode,
};

export const initialNodes: Node[] = [];

export const initialEdges: Edge[] = [];
