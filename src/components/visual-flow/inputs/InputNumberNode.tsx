
"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Hash } from 'lucide-react';

const handleStyle = {
  width: 12,
  height: 12,
  background: '#ef4444',
  border: 'none',
  boxShadow: 'none',
};

function InputNumberNode({ data, isConnectable, zIndex }: NodeProps<{ label: string }>) {
  return (
    <Card style={{ zIndex }} className="w-64 bg-red-500/20 shadow-lg border-red-500/80 border rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-3 p-4 pb-2">
        <Hash className="w-5 h-5 text-red-500" />
        <CardTitle className="text-base font-semibold text-foreground">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-end">
          <div className="relative flex items-center h-8">
            <span className="text-xs mr-2">Output</span>
            <Handle
              type="source"
              position={Position.Right}
              style={{ ...handleStyle, right: '-22px' }}
              isConnectable={isConnectable}
              id="number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(InputNumberNode);
