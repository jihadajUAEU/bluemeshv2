import { FC, useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
} from 'reactflow';
import {
  Box,
  Button,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
  Select,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  useAppDispatch,
  useCurrentWorkflow,
  useWorkflowNodes,
  useWorkflowEdges,
} from '../../hooks/useAppStore';
import {
  createWorkflow,
  updateWorkflow,
  updateNodes,
  updateEdges,
} from '../../store/workflowSlice';
import { WorkflowData } from '../../types/workflow';
import { 
  SimpleNode,
  SimpleEdge,
  nodeTypes,
  edgeTypes,
  createNewNode,
  convertToFlowFormat,
  convertFromFlowFormat,
} from '../../types/flow';

import 'reactflow/dist/style.css';

interface WorkflowForm {
  name: string;
  data_classification: string;
  data_region: string;
  cross_border_allowed: boolean;
}

const DATA_CLASSIFICATIONS = [
  { label: 'Public', value: 'public' },
  { label: 'Internal', value: 'internal' },
  { label: 'Confidential', value: 'confidential' },
  { label: 'Restricted', value: 'restricted' },
];

const DATA_REGIONS = [
  { label: 'US East', value: 'us-east' },
  { label: 'US West', value: 'us-west' },
  { label: 'EU West', value: 'eu-west' },
  { label: 'Asia Pacific', value: 'ap-east' },
];

const WorkflowBuilder: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentWorkflow = useCurrentWorkflow();
  const savedNodes = useWorkflowNodes();
  const savedEdges = useWorkflowEdges();

  const [nodes, setNodes] = useState<SimpleNode[]>([]);
  const [edges, setEdges] = useState<SimpleEdge[]>([]);

  const form = useForm<WorkflowForm>({
    initialValues: {
      name: '',
      data_classification: 'internal',
      data_region: 'us-east',
      cross_border_allowed: false,
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
    },
  });

  useEffect(() => {
    if (currentWorkflow) {
      form.setValues({
        name: currentWorkflow.name,
        data_classification: currentWorkflow.data_classification,
        data_region: currentWorkflow.data_region,
        cross_border_allowed: currentWorkflow.cross_border_allowed,
      });
    }
  }, [currentWorkflow]);

  useEffect(() => {
    if (savedNodes.length > 0) {
      const flowNodes = savedNodes.map(node => convertToFlowFormat<SimpleNode>(node));
      setNodes(flowNodes);
    }
    if (savedEdges.length > 0) {
      const flowEdges = savedEdges.map(edge => convertToFlowFormat<SimpleEdge>(edge));
      setEdges(flowEdges);
    }
  }, [savedNodes, savedEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds) as SimpleNode[];
      dispatch(updateNodes(updatedNodes.map(node => convertFromFlowFormat(node))));
      return updatedNodes;
    });
  }, [dispatch]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const updatedEdges = applyEdgeChanges(changes, eds) as SimpleEdge[];
      dispatch(updateEdges(updatedEdges.map(edge => convertFromFlowFormat(edge))));
      return updatedEdges;
    });
  }, [dispatch]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge({ ...params, type: 'default' }, eds);
      return newEdges;
    });
  }, []);

  const handleSubmit = async (values: WorkflowForm) => {
    const workflowData: Partial<WorkflowData> = {
      ...values,
      status: 'draft',
    };

    try {
      if (id) {
        await dispatch(updateWorkflow({ id, workflow: workflowData }));
      } else {
        await dispatch(createWorkflow(workflowData));
      }
      navigate('/workflows');
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  return (
    <Container size="xl">
      <Paper shadow="xs" p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={2}>{id ? 'Edit Workflow' : 'Create New Workflow'}</Title>
            <Group>
              <Button variant="light" onClick={() => navigate('/workflows')}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => form.onSubmit(handleSubmit)()}>
                Save
              </Button>
            </Group>
          </Group>

          <Group grow>
            <TextInput
              label="Workflow Name"
              placeholder="Enter workflow name"
              {...form.getInputProps('name')}
            />
            <Select
              label="Data Classification"
              data={DATA_CLASSIFICATIONS}
              {...form.getInputProps('data_classification')}
            />
            <Select
              label="Data Region"
              data={DATA_REGIONS}
              {...form.getInputProps('data_region')}
            />
          </Group>

          <Box style={{ height: '70vh', border: '1px solid #eee' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              minZoom={0.2}
              maxZoom={4}
            >
              <Background color="#aaa" gap={16} />
              <Controls />
              <Panel position="top-right">
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => {
                    const newNode = createNewNode({
                      position: { x: 100, y: 100 },
                      data: {
                        type: 'task',
                        label: `Node ${nodes.length + 1}`,
                      },
                    });
                    setNodes((nds) => [...nds, newNode]);
                  }}
                >
                  Add Node
                </Button>
              </Panel>
            </ReactFlow>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default WorkflowBuilder;
