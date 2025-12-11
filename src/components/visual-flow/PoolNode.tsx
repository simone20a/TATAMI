
"use client";

import { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Box, Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

type KeyType = {
  id: number;
  type: 'String' | 'Address';
};

type TokenInfo = {
    name: string;
    type: 'Fungible' | 'Non-Fungible';
};

type PoolNodeData = {
  label: string;
  name: string;
  selectedToken?: string;
  allTokens?: TokenInfo[];
  keys?: KeyType[];
};

function PoolNode({ id, data, zIndex }: NodeProps<PoolNodeData>) {
  const { label, name, allTokens = [], selectedToken, keys = [] } = data;
  const { setNodes } = useReactFlow();

  const handleInputChange = (field: 'name' | 'selectedToken', value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          console.log(`Node ${node.id}: changing ${field} to ${value}`);
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  const addKey = () => {
    const newKey = { id: keys.length > 0 ? Math.max(...keys.map(k => k.id)) + 1 : 0, type: 'String' as const };
    const newKeys = [...keys, newKey];
    updateKeys(newKeys);
  };

  const removeKey = () => {
    if (keys.length === 0) return;
    const newKeys = keys.slice(0, -1);
    updateKeys(newKeys);
  };
  
  const updateKeys = (newKeys: KeyType[]) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, keys: newKeys } };
        }
        return node;
      })
    );
  }

  const handleKeyTypeChange = (keyId: number, newType: 'String' | 'Address') => {
    const newKeys = keys.map(key => key.id === keyId ? { ...key, type: newType } : key);
    updateKeys(newKeys);
  }

  return (
    <Card style={{ zIndex }} className="w-72 bg-card shadow-lg border-cyan-500/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center space-x-3">
          <Box className="w-5 h-5 text-cyan-500" />
          <CardTitle className="text-base font-semibold text-foreground">{label}</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addKey}>
                <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeKey} disabled={keys.length === 0}>
                <Minus className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex flex-col space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`name-${id}`} className="text-xs">Name</Label>
                <Input id={`name-${id}`} type="text" value={name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`token-${id}`} className="text-xs">Token</Label>
                <Select value={selectedToken} onValueChange={(value) => handleInputChange('selectedToken', value)}>
                    <SelectTrigger id={`token-${id}`} className="w-full bg-background/50 border-border text-xs h-8">
                        <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                    <SelectContent>
                        {allTokens.map((token, index) => (
                            <SelectItem key={`${token.name}-${index}`} value={token.name}>{token.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {keys.map((key, index) => (
              <div key={key.id} className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`key-type-${id}-${key.id}`} className="text-xs">{`Key ${index + 1}`}</Label>
                 <Select value={key.type} onValueChange={(value: 'String' | 'Address') => handleKeyTypeChange(key.id, value)}>
                    <SelectTrigger id={`key-type-${id}-${key.id}`} className="w-full bg-background/50 border-border text-xs h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Address">Address</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(PoolNode);
