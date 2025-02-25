import { FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, Text, Box, Badge, Stack, Group, Progress } from '@mantine/core';
import { AgentNodeData } from './BaseAgentNode';

export interface QAAgentNodeData extends AgentNodeData {
  test_count?: number;
  passed_tests?: number;
  failed_tests?: number;
  test_coverage?: number;
  issues?: { severity: 'low' | 'medium' | 'high' | 'critical'; description: string }[];
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'blue';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

const QAAgentNode: FC<NodeProps<QAAgentNodeData>> = ({ data, ...props }) => {
  // Ensure agent_type is set
  const nodeData = { ...data, agent_type: 'qa' };
  
  // Calculate test pass rate
  const passRate = nodeData.test_count && nodeData.passed_tests 
    ? Math.round((nodeData.passed_tests / nodeData.test_count) * 100) 
    : undefined;
  
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
        
        {nodeData.test_count !== undefined && (
          <Box>
            <Text size="xs" fw={500}>Tests: {nodeData.test_count}</Text>
            {nodeData.passed_tests !== undefined && nodeData.failed_tests !== undefined && (
              <Group gap={8}>
                <Text size="xs" c="green">Passed: {nodeData.passed_tests}</Text>
                <Text size="xs" c="red">Failed: {nodeData.failed_tests}</Text>
              </Group>
            )}
            {passRate !== undefined && (
              <>
                <Text size="xs">Pass Rate: {passRate}%</Text>
                <Progress 
                  value={passRate} 
                  size="xs" 
                  mt={4}
                  color={passRate > 90 ? 'green' : passRate > 70 ? 'yellow' : 'red'}
                />
              </>
            )}
          </Box>
        )}
        
        {nodeData.test_coverage !== undefined && (
          <Box>
            <Text size="xs" fw={500}>Coverage: {nodeData.test_coverage}%</Text>
            <Progress 
              value={nodeData.test_coverage} 
              size="xs" 
              mt={4}
              color={nodeData.test_coverage > 80 ? 'green' : nodeData.test_coverage > 60 ? 'yellow' : 'red'}
            />
          </Box>
        )}
        
        {nodeData.issues && nodeData.issues.length > 0 && (
          <Box>
            <Text size="xs" fw={500}>Issues:</Text>
            <Stack gap={4} mt={2}>
              {nodeData.issues.slice(0, 3).map((issue, index) => (
                <Group key={index} gap={4} align="center">
                  <Badge size="xs" color={getSeverityColor(issue.severity)}>
                    {issue.severity}
                  </Badge>
                  <Text size="xs" truncate>
                    {issue.description}
                  </Text>
                </Group>
              ))}
              {nodeData.issues.length > 3 && (
                <Text size="xs" c="dimmed">
                  +{nodeData.issues.length - 3} more issues
                </Text>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default QAAgentNode;
