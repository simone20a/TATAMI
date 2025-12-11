"use client";

import { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleDollarSign } from 'lucide-react';

function FungibleTokenNode({ id, data, zIndex }: NodeProps<{ label: string; name: string, symbol: string }>) {
  const { setNodes } = useReactFlow();

  const handleInputChange = (field: 'name' | 'symbol', value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };
  
  return (
    <Card style={{ zIndex }} className="w-72 bg-card shadow-lg border-orange-500/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <CircleDollarSign className="w-5 h-5 text-orange-500" />
        <CardTitle className="text-base font-semibold text-foreground">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex flex-col space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`name-${id}`} className="text-xs">Name</Label>
                <Input id={`name-${id}`} type="text" value={data.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`symbol-${id}`} className="text-xs">Symbol</Label>
                <Input id={`symbol-${id}`} type="text" value={data.symbol} onChange={(e) => handleInputChange('symbol', e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(FungibleTokenNode);
