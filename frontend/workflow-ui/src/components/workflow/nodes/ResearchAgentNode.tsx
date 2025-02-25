import { FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, Text, Box, Badge, Stack, Group } from '@mantine/core';
import { AgentNodeData } from './BaseAgentNode';

export interface ResearchAgentNodeData extends AgentNodeData {
  research_topics?: string[];
  data_sources?: string[];
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

const ResearchAgentNode: FC<NodeProps<ResearchAgentNodeData>> = ({ data, ...props }) => {
  // Ensure agent_type is set
  const nodeData = { ...data, agent_type: 'research' };
  
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder style={{ minWidth: 200 }}>
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
        
        {nodeData.research_topics && nodeData.research_topics.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Research Topics:</Text>
            <Box pl="xs">
              {nodeData.research_topics.map((topic, index) => (
                <Text key={index} size="xs">{topic}</Text>
              ))}
            </Box>
          </Box>
        )}
        
        {nodeData.data_sources && nodeData.data_sources.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Data Sources:</Text>
            <Box pl="xs">
              {nodeData.data_sources.map((source, index) => (
                <Text key={index} size="xs">{source}</Text>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default ResearchAgentNode;
