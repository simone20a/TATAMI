
"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const handleStyle = {
  width: 12,
  height: 12,
  border: 'none',
  boxShadow: 'none',
};

const defaultSourceHandleStyle = {
  ...handleStyle,
  background: 'hsl(var(--primary))',
};

const numberHandleStyle = {
  ...handleStyle,
  background: '#ef4444',
};

type TokenSelection = {
  id: number;
  selectedToken?: string;
};

type EntryNodeData = {
  label: string;
  name: string;
  tokens?: { name: string; type: 'Fungible' | 'Non-Fungible' }[];
  tokenSelections?: TokenSelection[];
};

function EntryNode({ id, data, isConnectable }: NodeProps<EntryNodeData>) {
  const { label, name, tokens = [], tokenSelections = [] } = data;
  const { setNodes } = useReactFlow();

  const handleInputChange = (field: 'name', value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  const handleTokenSelectionChange = (selectionId: number, selectedToken: string) => {
    const newSelections = tokenSelections.map(selection =>
      selection.id === selectionId ? { ...selection, selectedToken } : selection
    );
    updateSelections(newSelections);
  };

  const addTokenSelection = () => {
    const newSelection = { id: tokenSelections.length > 0 ? Math.max(...tokenSelections.map(s => s.id)) + 1 : 0 };
    updateSelections([...tokenSelections, newSelection]);
  };

  const removeTokenSelection = () => {
    if (tokenSelections.length <= 1) return;
    const newSelections = tokenSelections.slice(0, -1);
    updateSelections(newSelections);
  };

  const updateSelections = (newSelections: TokenSelection[]) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, tokenSelections: newSelections } };
        }
        return node;
      })
    );
  };

  return (
    <Card className="w-80 bg-card shadow-lg border-primary/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center space-x-3">
          <LogIn className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold text-foreground">{label}</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addTokenSelection}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeTokenSelection} disabled={tokenSelections.length <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor={`name-${id}`} className="text-xs">Name</Label>
          <Input id={`name-${id}`} type="text" value={name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
        </div>

        {tokenSelections.map((selection, index) => (
          <div key={selection.id} className="flex justify-between items-center space-x-2">
            <div className="flex-1 space-y-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`token-${id}-${selection.id}`} className="text-xs">Token {index + 1}</Label>
                <Select value={selection.selectedToken} onValueChange={(value) => handleTokenSelectionChange(selection.id, value)}>
                  <SelectTrigger id={`token-${id}-${selection.id}`} className="w-full bg-background/50 border-border text-xs h-8">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={`${token.name}-${selection.id}`} value={token.name}>{token.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {tokens.find(t => t.name === selection.selectedToken)?.type === 'Fungible' ? (
                <div className="relative flex items-center h-8">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`number-quantity-${selection.id}`}
                    style={{ ...numberHandleStyle, left: '-22px' }}
                    isConnectable={isConnectable}
                  />
                  <div className="text-xs ml-2">Quantity</div>
                </div>
              ) : (
                <div className="relative flex items-center h-8">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`number-id-${selection.id}`}
                    style={{ ...numberHandleStyle, left: '-22px' }}
                    isConnectable={isConnectable}
                  />
                  <div className="text-xs ml-2">Id</div>
                </div>
              )}
            </div>

            <div className="relative flex items-center h-8">
              <div className="text-xs mr-2">Output {index + 1}</div>
              <Handle
                type="source"
                position={Position.Right}
                id={`output-stream-${selection.id}`}
                style={{ ...defaultSourceHandleStyle, right: '-22px' }}
                isConnectable={isConnectable}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default memo(EntryNode);
