import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Group,
  Text,
  Badge,
  Card,
  Stack,
  Pagination,
} from '@mantine/core';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  useAppDispatch,
  useWorkflows,
  useWorkflowLoading,
  useWorkflowError,
  useExecutionStatus,
  useTotal,
  isError,
} from '@/hooks/useAppStore';
import { fetchWorkflows, deleteWorkflow } from '@/store/workflowSlice';
import type { WorkflowExecutionStatus } from '@/types/workflow';
import type { AppDispatch } from '@/store';

const getStatusColor = (status: WorkflowExecutionStatus): string => {
  switch (status) {
    case 'running':
      return 'blue';
    case 'completed':
      return 'green';
    case 'failed':
      return 'red';
    case 'cancelled':
      return 'orange';
    default:
      return 'gray';
  }
};

const WorkflowList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const workflows = useWorkflows();
  const loading = useWorkflowLoading();
  const error = useWorkflowError();
  const executionStatus = useExecutionStatus();
  const total = useTotal();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchWorkflows({ page: currentPage, limit: pageSize })).unwrap();
        if (!result) {
          console.error('No data returned from fetch workflows');
        }
      } catch (err) {
        if (isError(err)) {
          console.error('Failed to fetch workflows:', err.message);
        }
      }
    };
    void fetchData();
  }, [dispatch, currentPage]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        const result = await dispatch(deleteWorkflow(id)).unwrap();
        if (!result) {
          console.error('No response from delete workflow');
        }
      } catch (err) {
        if (isError(err)) {
          console.error('Failed to delete workflow:', err.message);
        }
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text c="red">{error}</Text>;
  }

  return (
    <Stack gap="md">
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Text size="xl" fw={500}>
            Workflows
          </Text>
          <Button onClick={() => navigate('/workflows/new')}>
            Create Workflow
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Data Classification</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Last Modified</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workflows.map((workflow) => (
              <Table.Tr key={workflow.id}>
                <Table.Td>{workflow.name}</Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusColor(workflow.execution_status)}
                    variant="light"
                  >
                    {workflow.execution_status}
                  </Badge>
                  {executionStatus[workflow.id] && (
                    <Text size="xs" c="dimmed" mt={4}>
                      {executionStatus[workflow.id].message}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Badge>{workflow.data_classification}</Badge>
                </Table.Td>
                <Table.Td>{workflow.data_region}</Table.Td>
                <Table.Td>
                  {workflow.updated_at
                    ? formatDistanceToNow(parseISO(workflow.updated_at), { addSuffix: true })
                    : 'N/A'}
                </Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => navigate(`/workflows/${workflow.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => void handleDelete(workflow.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            total={Math.ceil(total / pageSize)}
            onChange={setCurrentPage}
            size="sm"
          />
        </Group>
      </Card>
    </Stack>
  );
};

export default WorkflowList;
