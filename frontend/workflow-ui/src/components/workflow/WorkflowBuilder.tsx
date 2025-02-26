import { Box, Paper, Stack, Text, Button, Group } from '@mantine/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './WorkflowBuilder.css';

import ConditionalEdge from './edges/ConditionalEdge';
import AnalysisAgentNode from './nodes/AnalysisAgentNode';
import BaseAgentNode, { AgentNodeData } from './nodes/BaseAgentNode';
import { useAppDispatch } from '../../hooks/useAppStore';

const nodeTypes = {
  base: BaseAgentNode,
  analysis: AnalysisAgentNode,
};

const edgeTypes = {
  conditional: ConditionalEdge,
};

const initialNodes: Node<AgentNodeData>[] = [];
const initialEdges: Edge[] = [];

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper p="md" style={{ width: '200px' }}>
      <Stack>
        <Text fw={500}>Node Types</Text>
        <div 
          onDragStart={(e) => onDragStart(e, 'base')}
          draggable
          style={{ 
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '8px',
            cursor: 'grab'
          }}
        >
          Base Agent
        </div>
        <div 
          onDragStart={(e) => onDragStart(e, 'analysis')}
          draggable
          style={{ 
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'grab'
          }}
        >
          Analysis Agent
        </div>
      </Stack>
    </Paper>
  );
};

const WorkflowBuilder: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const dispatch = useAppDispatch();
  const { project } = useReactFlow();
  
  const [nodes, setNodes] = React.useState<Node<AgentNodeData>[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = React.useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const { top, left } = (event.target as HTMLElement)
        .closest('.react-flow')
        ?.getBoundingClientRect() || { top: 0, left: 0 };
      
      const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
      });

      const newNode: Node<AgentNodeData> = {
        id: `${type}_${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
          agent_type: type,
          type: type,
          status: 'idle'
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, project]
  );

  const onSave = () => {
    // TODO: Implement save functionality
    console.log('Saving workflow:', { nodes, edges });
  };

  return (
    <Box style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
      <Group mb="md" justify="space-between">
        <Text size="xl" fw={500}>{isEditing ? 'Edit Workflow' : 'Create New Workflow'}</Text>
        <Button onClick={onSave}>Save Workflow</Button>
      </Group>
      
      <Box style={{ width: '100%', height: '100%', display: 'flex' }}>
        <Sidebar />
        <Box style={{ flexGrow: 1, height: '100%', border: '1px solid #eee', borderRadius: '4px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkflowBuilder;
