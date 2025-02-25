import { FC } from 'react';
import { EdgeProps, getBezierPath, BaseEdge } from 'reactflow';
import { Text } from '@mantine/core';
import { FlowEdgeData } from '../../../types/flow';

const ConditionalEdge: FC<EdgeProps<FlowEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {data?.condition && (
        <Text
          size="xs"
          style={{
            position: 'absolute',
            left: labelX - 15,
            top: labelY - 10,
            backgroundColor: 'white',
            padding: '2px 4px',
            borderRadius: 4,
            fontSize: 10,
            pointerEvents: 'none',
            border: '1px solid #ccc',
          }}
        >
          {data.condition}
        </Text>
      )}
    </>
  );
};

export default ConditionalEdge;
