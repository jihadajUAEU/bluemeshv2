import React from 'react';
import { vi } from 'vitest';
import type { Edge, Node, XYPosition } from 'reactflow';

const mockReactFlow = vi.fn(() => null);
const mockControls = vi.fn(() => null);
const mockBackground = vi.fn(() => null);
const mockMiniMap = vi.fn(() => null);
const mockPanel = vi.fn(() => null);

export const ReactFlowProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const Background = mockBackground;
export const Controls = mockControls;
export const MiniMap = mockMiniMap;
export const Panel = mockPanel;
export const ReactFlow = mockReactFlow;

export const useReactFlow = vi.fn(() => ({
  project: vi.fn((pos: XYPosition) => pos),
  getNodes: vi.fn((): Node[] => []),
  getEdges: vi.fn((): Edge[] => []),
  setNodes: vi.fn(),
  setEdges: vi.fn(),
  addNodes: vi.fn(),
  addEdges: vi.fn(),
}));

export const useNodesState = vi.fn(() => [[] as Node[], vi.fn()]);
export const useEdgesState = vi.fn(() => [[] as Edge[], vi.fn()]);

export const getBezierPath = vi.fn(() => 'M0 0 C0 0, 0 0, 0 0');
export const BaseEdge = vi.fn(({ id }: { id: string }) => (
  <path id={id} d="M0 0 C0 0, 0 0, 0 0" />
));

export const Position = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
} as const;
