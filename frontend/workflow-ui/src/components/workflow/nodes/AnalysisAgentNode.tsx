import { FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, Text, Box, Badge, Stack, Group } from '@mantine/core';
import { AgentNodeData } from './BaseAgentNode';

export interface AnalysisAgentNodeData extends AgentNodeData {
  analysis_type?: string;
  data_points?: number;
  insights?: string[];
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

const AnalysisAgentNode: FC<NodeProps<AnalysisAgentNodeData>> = ({ data, ...props }) => {
  // Ensure agent_type is set
  const nodeData = { ...data, agent_type: 'analysis' };
  
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
          {nodeData.analysis_type && (
            <Text size="xs" c="dimmed">
              Analysis Type: {nodeData.analysis_type}
            </Text>
          )}
          {nodeData.data_points && (
            <Text size="xs" c="dimmed">
              Data Points: {nodeData.data_points}
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
        
        {nodeData.insights && nodeData.insights.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Key Insights:</Text>
            <Box pl="xs">
              {nodeData.insights.map((insight, index) => (
                <Text key={index} size="xs">{insight}</Text>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default AnalysisAgentNode;
