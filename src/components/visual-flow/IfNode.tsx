"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const handleStyle = {
  width: 12,
  height: 12,
  border: 'none',
  boxShadow: 'none',
};

const booleanHandleStyle = {
  ...handleStyle,
  background: '#eab308',
};

const defaultTargetHandleStyle = {
  ...handleStyle,
  background: 'hsl(var(--accent))',
};

const defaultSourceHandleStyle = {
    ...handleStyle,
    background: 'hsl(var(--primary))',
};

function IfNode({ data, isConnectable }: NodeProps<{ label: string }>) {
  return (
    <Card className="w-72 bg-card shadow-lg border-primary/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <GitBranch className="w-5 h-5 text-primary" />
        <CardTitle className="text-base font-semibold text-foreground">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex justify-between">
            {/* Input Column */}
            <div className="flex flex-col space-y-2">
                <div className="relative flex items-center h-8">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id="boolean-condition"
                    style={{...booleanHandleStyle, left: '-22px'}}
                    isConnectable={isConnectable}
                  />
                  <div className="text-xs ml-2">Condition</div>
                </div>
                <div className="relative flex items-center h-8">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id="input-stream"
                    style={{...defaultTargetHandleStyle, left: '-22px'}}
                    isConnectable={isConnectable}
                  />
                  <div className="text-xs ml-2">Input stream</div>
                </div>
            </div>
             {/* Output Column */}
            <div className="flex flex-col space-y-2 items-end">
                <div className="relative flex items-center h-8">
                  <div className="text-xs mr-2">Then</div>
                   <Handle
                    type="source"
                    position={Position.Right}
                    id="then"
                    style={{...defaultSourceHandleStyle, right: '-22px'}}
                    isConnectable={isConnectable}
                  />
                </div>
                <div className="relative flex items-center h-8">
                  <div className="text-xs mr-2">Else</div>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id="else"
                    style={{...defaultSourceHandleStyle, right: '-22px'}}
                    isConnectable={isConnectable}
                  />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(IfNode);
