import { FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Text, Box, Card } from '@mantine/core';
import { FlowNodeData } from '../../../types/flow';

const TaskNode: FC<NodeProps<FlowNodeData>> = ({ data }) => {
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder style={{ minWidth: 150 }}>
      <Handle type="target" position={Position.Top} />
      <Box p="xs">
        <Text size="sm" fw={500}>
          {data.label}
        </Text>
        <Text size="xs" c="dimmed">
          {data.type}
        </Text>
      </Box>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default TaskNode;
