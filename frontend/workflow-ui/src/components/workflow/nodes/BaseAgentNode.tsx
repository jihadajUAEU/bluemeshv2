import { FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Text, Box, Badge, Stack, Group } from '@mantine/core';
import { FlowNodeData } from '../../../types/flow';

export interface AgentNodeData extends FlowNodeData {
  agent_type: string;
  status?: 'idle' | 'running' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'running':
      return 'blue';
    case 'completed':
      return 'green';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

const BaseAgentNode: FC<NodeProps<AgentNodeData>> = ({ data }) => {
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Top} />
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            {data.label}
          </Text>
          <Badge size="sm" color={getStatusColor(data.status)}>
            {data.status || 'idle'}
          </Badge>
        </Group>
        
        <Box>
          <Text size="xs" c="dimmed">
            Agent Type: {data.agent_type}
          </Text>
          {data.progress !== undefined && (
            <Text size="xs" c="dimmed">
              Progress: {data.progress}%
            </Text>
          )}
          {data.error && (
            <Text size="xs" c="red">
              Error: {data.error}
            </Text>
          )}
        </Box>
      </Stack>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default BaseAgentNode;
