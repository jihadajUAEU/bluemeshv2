import { FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, Text, Box, Badge, Stack, Group, Progress } from '@mantine/core';
import { AgentNodeData } from './BaseAgentNode';

export interface ImplementationAgentNodeData extends AgentNodeData {
  implementation_type?: string;
  technologies?: string[];
  code_snippets?: { language: string; code: string }[];
  completion_rate?: number;
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

const ImplementationAgentNode: FC<NodeProps<ImplementationAgentNodeData>> = ({ data, ...props }) => {
  // Ensure agent_type is set
  const nodeData = { ...data, agent_type: 'implementation' };
  
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder style={{ minWidth: 220 }}>
      <Handle type="target" position={Position.Top} />
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            {nodeData.label}
          </Text>
          <Badge size="sm" color={getStatusColor(nodeData.status)}>
            {nodeData.status || 'idle'}
          </Badge>
        </Group>
        
        <Box>
          <Text size="xs" c="dimmed">
            Agent Type: {nodeData.agent_type}
          </Text>
          {nodeData.implementation_type && (
            <Text size="xs" c="dimmed">
              Implementation: {nodeData.implementation_type}
            </Text>
          )}
          {nodeData.progress !== undefined && (
            <Text size="xs" c="dimmed">
              Progress: {nodeData.progress}%
            </Text>
          )}
          {nodeData.error && (
            <Text size="xs" c="red">
              Error: {nodeData.error}
            </Text>
          )}
        </Box>
        
        {nodeData.completion_rate !== undefined && (
          <Box>
            <Text size="xs" fw={500}>Completion: {nodeData.completion_rate}%</Text>
            <Progress value={nodeData.completion_rate} size="xs" mt={4} />
          </Box>
        )}
        
        {nodeData.technologies && nodeData.technologies.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Technologies:</Text>
            <Group gap={4} mt={2}>
              {nodeData.technologies.map((tech, index) => (
                <Badge key={index} size="xs" variant="light">
                  {tech}
                </Badge>
              ))}
            </Group>
          </Box>
        )}
        
        {nodeData.code_snippets && nodeData.code_snippets.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Code Snippets:</Text>
            <Text size="xs" c="dimmed">
              {nodeData.code_snippets.length} snippet(s) available
            </Text>
          </Box>
        )}
      </Stack>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default ImplementationAgentNode;
