
"use client";

import { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Diamond, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Attribute = {
  id: number;
  name: string;
  type: 'String' | 'Number' | 'Boolean' | 'Address';
};

type NonFungibleTokenNodeData = {
  label: string;
  name: string;
  attributes?: Attribute[];
};

function NonFungibleTokenNode({ id, data, zIndex }: NodeProps<NonFungibleTokenNodeData>) {
  const { name, attributes = [] } = data;
  const { setNodes } = useReactFlow();

  const handleNameChange = (newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, name: newName } };
        }
        return node;
      })
    );
  };

  const addAttribute = () => {
    const newAttribute: Attribute = {
      id: attributes.length > 0 ? Math.max(...attributes.map(a => a.id)) + 1 : 0,
      name: `attr${attributes.length + 1}`,
      type: 'String',
    };
    const newAttributes = [...attributes, newAttribute];
    updateAttributes(newAttributes);
  };

  const removeAttribute = () => {
    if (attributes.length === 0) return;
    const newAttributes = attributes.slice(0, -1);
    updateAttributes(newAttributes);
  };

  const handleAttributeChange = (attributeId: number, field: 'name' | 'type', value: string) => {
    const newAttributes = attributes.map(attr => 
      attr.id === attributeId ? { ...attr, [field]: value } : attr
    );
    updateAttributes(newAttributes);
  };
  
  const updateAttributes = (newAttributes: Attribute[]) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, attributes: newAttributes } };
        }
        return node;
      })
    );
  };
  
  return (
    <Card style={{ zIndex }} className="w-72 bg-card shadow-lg border-purple-500/50 border rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center space-x-3">
          <Diamond className="w-5 h-5 text-purple-500" />
          <CardTitle className="text-base font-semibold text-foreground">{data.label}</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addAttribute}>
                <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeAttribute} disabled={attributes.length === 0}>
                <Minus className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-foreground">
        <div className="flex flex-col space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`name-${id}`} className="text-xs">Name</Label>
                <Input id={`name-${id}`} type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
            </div>
            {attributes.map((attr, index) => (
              <div key={attr.id} className="grid grid-cols-2 gap-2 items-center">
                <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor={`attr-name-${id}-${attr.id}`} className="text-xs">{`Attribute ${index + 1}`}</Label>
                    <Input id={`attr-name-${id}-${attr.id}`} type="text" value={attr.name} onChange={(e) => handleAttributeChange(attr.id, 'name', e.target.value)} className="w-full bg-background/50 border-border text-xs h-8" />
                </div>
                <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor={`attr-type-${id}-${attr.id}`} className="text-xs">Type</Label>
                    <Select value={attr.type} onValueChange={(value: 'String' | 'Number' | 'Boolean' | 'Address') => handleAttributeChange(attr.id, 'type', value)}>
                        <SelectTrigger id={`attr-type-${id}-${attr.id}`} className="w-full bg-background/50 border-border text-xs h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="String">String</SelectItem>
                            <SelectItem value="Number">Number</SelectItem>
                            <SelectItem value="Boolean">Boolean</SelectItem>
                            <SelectItem value="Address">Address</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(NonFungibleTokenNode);
