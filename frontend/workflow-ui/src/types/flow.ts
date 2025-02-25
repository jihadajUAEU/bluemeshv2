import { Node, Edge, NodeProps, EdgeProps } from 'reactflow';
import TaskNode from '../components/workflow/nodes/TaskNode';
import ConditionalEdge from '../components/workflow/edges/ConditionalEdge';

export interface FlowNodeData {
  type: string;
  label: string;
  config?: Record<string, unknown>;
}

export interface FlowEdgeData {
  condition?: string;
}

// Define simpler node and edge types without nesting
export type SimpleNode = Node<FlowNodeData>;
export type SimpleEdge = Edge<FlowEdgeData>;

// Component props types
export type TaskNodeProps = NodeProps<FlowNodeData>;
export type ConditionalEdgeProps = EdgeProps<FlowEdgeData>;

// Node and edge type definitions
export const nodeTypes = {
  task: TaskNode,
  default: TaskNode,
} as const;

export const edgeTypes = {
  default: ConditionalEdge,
  conditional: ConditionalEdge,
} as const;

// Create node with default values
export const createNewNode = ({
  id,
  position,
  data,
}: {
  id?: string;
  position: { x: number; y: number };
  data?: Partial<FlowNodeData>;
}): SimpleNode => ({
  id: id || `node-${Date.now()}`,
  type: 'default',
  position,
  data: {
    type: data?.type || 'task',
    label: data?.label || 'New Node',
    config: data?.config || {},
  },
  draggable: true,
  selectable: true,
});

// Create edge with default values
export const createNewEdge = ({
  id,
  source,
  target,
  data,
}: {
  id?: string;
  source: string;
  target: string;
  data?: FlowEdgeData;
}): SimpleEdge => ({
  id: id || `edge-${Date.now()}`,
  source,
  target,
  type: 'default',
  data: data || {},
});

// Converters
export const convertToFlowFormat = <T extends SimpleNode | SimpleEdge>(item: any): T => {
  if ('source' in item && 'target' in item) {
    return createNewEdge({
      id: item.id,
      source: item.source,
      target: item.target,
      data: item.data,
    }) as T;
  }
  
  return createNewNode({
    id: item.id,
    position: item.position || { x: 0, y: 0 },
    data: item.data,
  }) as T;
};

// Convert back to workflow format
export const convertFromFlowFormat = <T extends SimpleNode | SimpleEdge>(item: T): any => ({
  id: item.id,
  type: item.type,
  ...(('position' in item) ? { position: item.position } : {}),
  ...(('source' in item) ? { source: item.source, target: item.target } : {}),
  data: item.data,
});
