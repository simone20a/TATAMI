"use client";

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine } from 'lucide-react';

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

const addressHandleStyle = {
    ...handleStyle,
    background: '#3b82f6',
};

const stringHandleStyle = {
    ...handleStyle,
    background: '#22c55e',
};

const keyTypeToStyle: Record<string, React.CSSProperties> = {
    'Address': addressHandleStyle,
    'String': stringHandleStyle,
};

type PoolData = {
    name: string;
    keys?: { id: number; type: 'String' | 'Address' }[];
}

type DepositNodeData = {
    label: string;
    selectedPool?: string;
    pools?: PoolData[];
};
  
function DepositNode({ id, data, isConnectable }: NodeProps<DepositNodeData>) {
    const { label, pools = [], selectedPool } = data;
    const { setNodes } = useReactFlow();

    const handlePoolChange = (value: string) => {
        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, selectedPool: value } };
            }
            return node;
          })
        );
      };

    const selectedPoolData = useMemo(() => {
        return pools.find(p => p.name === selectedPool);
    }, [pools, selectedPool]);
    
    return (
        <Card className="w-72 bg-card shadow-lg border-primary/50 border rounded-lg">
        <CardHeader className="flex flex-row items-center space-x-3 p-4">
            <ArrowDownToLine className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">{label}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-foreground">
            <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-2">
                    <div className="relative flex items-center h-8">
                        <Handle
                            type="target"
                            position={Position.Left}
                            id="input-stream"
                            style={{ ...defaultTargetHandleStyle, left: '-22px' }}
                            isConnectable={isConnectable}
                        />
                        <div className="text-xs">Input stream</div>
                    </div>
                    {selectedPoolData?.keys?.map((key, index) => (
                        <div key={key.id} className="relative flex items-center h-8">
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={`${key.type.toLowerCase()}-key-${key.id}`}
                                style={{ ...keyTypeToStyle[key.type], left: '-22px' }}
                                isConnectable={isConnectable}
                            />
                            <div className="text-xs">{`Key ${index + 1}`}</div>
                        </div>
                    ))}
                </div>
                <div className="grid w-1/2 items-center gap-1.5 pt-2">
                    <Label htmlFor={`pool-${id}`} className="text-xs">Pool</Label>
                    <Select value={selectedPool} onValueChange={handlePoolChange}>
                        <SelectTrigger id={`pool-${id}`} className="w-full bg-background/50 border-border text-xs h-8">
                            <SelectValue placeholder="Select a pool" />
                        </SelectTrigger>
                        <SelectContent>
                            {pools
                                .filter(pool => pool.name)
                                .map((pool, index) => (
                                    <SelectItem key={`${pool.name}-${index}`} value={pool.name}>{pool.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
        </Card>
    );
}

export default memo(DepositNode);
