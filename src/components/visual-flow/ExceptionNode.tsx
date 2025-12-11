"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const handleStyle = {
  width: 12,
  height: 12,
  border: 'none',
  boxShadow: 'none',
};

const defaultTargetHandleStyle = {
  ...handleStyle,
  background: 'hsl(var(--accent))',
};

function ExceptionNode({ data, isConnectable }: NodeProps<{ label: string }>) {
  return (
    <Card className="w-72 bg-card shadow-lg border-destructive/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <CardTitle className="text-base font-semibold text-foreground">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex flex-col space-y-2">
            <div className="relative flex items-center h-8">
              <Handle
                type="target"
                position={Position.Left}
                id="input-stream"
                style={{ ...defaultTargetHandleStyle, left: '-22px' }}
                isConnectable={isConnectable}
              />
              <div className="text-xs ml-2">Input stream</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ExceptionNode);
