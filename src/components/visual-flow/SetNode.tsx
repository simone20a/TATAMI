
"use client";

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from 'lucide-react';
import { Variable } from './VariablesSheet';

const handleStyle = {
  width: 12,
  height: 12,
  border: 'none',
  boxShadow: 'none',
};

const defaultTargetHandleStyle = { ...handleStyle, background: 'hsl(var(--accent))' };
const defaultSourceHandleStyle = { ...handleStyle, background: 'hsl(var(--primary))' };

const typeToStyle: Record<string, React.CSSProperties> = {
    'String': { ...handleStyle, background: '#22c55e' },
    'Number': { ...handleStyle, background: '#ef4444' },
    'Boolean': { ...handleStyle, background: '#eab308' },
    'Address': { ...handleStyle, background: '#3b82f6' },
};

type SetNodeData = {
    label: string;
    selectedVariable?: string;
    variables?: Variable[];
};

function SetNode({ id, data, isConnectable }: NodeProps<SetNodeData>) {
    const { label, variables = [], selectedVariable } = data;
    const { setNodes } = useReactFlow();

    const handleVariableChange = (value: string) => {
        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, selectedVariable: value } };
            }
            return node;
          })
        );
    };

    const selectedVariableData = useMemo(() => {
        return variables.find(v => v.name === selectedVariable);
    }, [variables, selectedVariable]);

    return (
        <Card className="w-72 bg-card shadow-lg border-primary/50 border rounded-lg">
            <CardHeader className="flex flex-row items-center space-x-3 p-4">
                <Pencil className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-semibold text-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-foreground">
                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor={`variable-${id}`} className="text-xs">Variable</Label>
                    <Select value={selectedVariable} onValueChange={handleVariableChange}>
                        <SelectTrigger id={`variable-${id}`} className="w-full bg-background/50 border-border text-xs h-8">
                            <SelectValue placeholder="Select a variable" />
                        </SelectTrigger>
                        <SelectContent>
                            {variables.map((variable) => (
                                <SelectItem key={variable.id} value={variable.name}>{variable.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex justify-between">
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
                        {selectedVariableData && (
                            <div className="relative flex items-center h-8">
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`${selectedVariableData.type.toLowerCase()}-value`}
                                    style={{ ...typeToStyle[selectedVariableData.type], left: '-22px' }}
                                    isConnectable={isConnectable}
                                />
                                <div className="text-xs">Value</div>
                            </div>
                        )}
                    </div>
                    {/* Output Column */}
                    <div className="flex flex-col space-y-2 items-end justify-center">
                        <div className="relative flex items-center h-8">
                            <div className="text-xs mr-2">Stream</div>
                            <Handle
                                type="source"
                                position={Position.Right}
                                id="output-stream"
                                style={{ ...defaultSourceHandleStyle, right: '-22px' }}
                                isConnectable={isConnectable}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(SetNode);
