
"use client";

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const handleStyle = {
  width: 12,
  height: 12,
  border: 'none',
  boxShadow: 'none',
};

const numberHandleStyle = { ...handleStyle, background: '#ef4444' };
const stringHandleStyle = { ...handleStyle, background: '#22c55e' };
const booleanHandleStyle = { ...handleStyle, background: '#eab308' };
const addressHandleStyle = { ...handleStyle, background: '#3b82f6' };

const typeToStyle: Record<string, React.CSSProperties> = {
    'String': stringHandleStyle,
    'Number': numberHandleStyle,
    'Boolean': booleanHandleStyle,
    'Address': addressHandleStyle,
};

const defaultTargetHandleStyle = {
  ...handleStyle,
  background: 'hsl(var(--accent))',
};

const defaultSourceHandleStyle = {
    ...handleStyle,
    background: 'hsl(var(--primary))',
};

type TokenInfo = {
    name: string;
    type: 'Fungible' | 'Non-Fungible';
};

type Attribute = {
    id: number;
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'Address';
};
  
type NftData = {
    name: string;
    attributes: Attribute[];
};

type MintNodeData = {
    label: string;
    selectedToken?: string;
    allTokens?: TokenInfo[];
    nftData?: NftData[];
};

function MintNode({ id, data, isConnectable }: NodeProps<MintNodeData>) {
  const { label, allTokens = [], selectedToken, nftData = [] } = data;
  const { setNodes } = useReactFlow();

  const handleTokenChange = (value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, selectedToken: value } };
        }
        return node;
      })
    );
  };
    
  const selectedTokenInfo = useMemo(() => 
    allTokens.find(t => t.name === selectedToken),
    [allTokens, selectedToken]
  );

  const selectedNftAttributes = useMemo(() => {
    if (selectedTokenInfo?.type === 'Non-Fungible') {
      return nftData.find(nft => nft.name === selectedToken)?.attributes || [];
    }
    return [];
  }, [selectedTokenInfo, nftData, selectedToken]);

  return (
    <Card className="w-72 bg-card shadow-lg border-primary/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Coins className="w-5 h-5 text-primary" />
        <CardTitle className="text-base font-semibold text-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex justify-between items-start">
          {/* Input Column */}
          <div className="flex flex-col space-y-2">
            <div className="relative flex items-center h-8">
              <Handle
                type="target"
                position={Position.Left}
                id="input-stream"
                style={{ ...defaultTargetHandleStyle, left: '-22px' }}
                isConnectable={isConnectable}
              />
              <div className="text-xs">Stream</div>
            </div>
            {selectedTokenInfo?.type === 'Fungible' && (
                <div className="relative flex items-center h-8">
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="number-quantity"
                        style={{ ...numberHandleStyle, left: '-22px' }}
                        isConnectable={isConnectable}
                    />
                    <div className="text-xs">Quantity</div>
                </div>
            )}
            {selectedTokenInfo?.type === 'Non-Fungible' && selectedNftAttributes.map((attr) => (
                <div key={attr.id} className="relative flex items-center h-8">
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={`${attr.type.toLowerCase()}-${attr.name}-${attr.id}`}
                        style={{ ...(typeToStyle[attr.type] || defaultTargetHandleStyle), left: '-22px' }}
                        isConnectable={isConnectable}
                    />
                    <div className="text-xs">{attr.name}</div>
                </div>
            ))}
          </div>
          {/* Token Selector */}
          <div className="grid w-1/2 items-center gap-1.5 pt-2">
              <Label htmlFor={`token-${id}`} className="text-xs">Token</Label>
              <Select value={selectedToken} onValueChange={handleTokenChange}>
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
        </div>
        {/* Output Column */}
        <div className="flex flex-col space-y-2 items-end mt-2">
            <div className="relative flex items-center h-8">
                <div className="text-xs mr-2">Stream</div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="output"
                    style={{ ...defaultSourceHandleStyle, right: '-22px' }}
                    isConnectable={isConnectable}
                />
            </div>
            <div className="relative flex items-center h-8">
                <div className="text-xs mr-2">Minted</div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="minted-output"
                    style={{ ...defaultSourceHandleStyle, right: '-22px' }}
                    isConnectable={isConnectable}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(MintNode);
