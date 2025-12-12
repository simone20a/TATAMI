
"use client";

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export type Variable = {
    id: string;
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'Address';
    scope: 'constant' | 'input' | 'state' | 'variable';
    value?: string;
    isDeletable?: boolean;
    metadata?: any;
};

export const globalStateVariables: Variable[] = [
    {
        id: 'global-sender',
        name: 'Sender',
        type: 'Address',
        scope: 'state',
        isDeletable: false,
    },
    {
        id: 'global-blocknumber',
        name: 'BlockNumber',
        type: 'Number',
        scope: 'state',
        isDeletable: false,
    }
];

interface VariablesSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variables: Variable[];
    setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
}

const typeColors: { [key in Variable['type']]: string } = {
    String: 'bg-green-500',
    Number: 'bg-red-500',
    Boolean: 'bg-yellow-500',
    Address: 'bg-blue-500',
};

const renderStateVariableDescription = (v: Variable) => {
    if (v.id.startsWith('global-')) {
        return `${v.type} - Read-only State`;
    }
    if (v.name.includes('_balanceOf')) {
        return `(${v.metadata?.inputType || 'Address'}) => Number - Read-only State`;
    }
    if (v.name.includes('_amount')) {
        return `Number - Read-only State`;
    }
    if (v.id.startsWith('state-var-attr-')) {
        const inputType = v.metadata?.inputType || 'Number';
        return `(${inputType} id) => ${v.type} - Read-only State`;
    }
    return `${v.type} - Read-only State`;
};

export default function VariablesSheet({ open, onOpenChange, variables, setVariables }: VariablesSheetProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newVarName, setNewVarName] = useState('');
    const [newVarType, setNewVarType] = useState<'String' | 'Number' | 'Boolean' | 'Address'>('String');
    const [newVarScope, setNewVarScope] = useState<'constant' | 'input' | 'variable'>('constant');
    const [newVarValue, setNewVarValue] = useState('');

    const addVariable = () => {
        if (newVarName.trim() === '') return;
        const newVariable: Variable = {
            id: crypto.randomUUID(),
            name: newVarName.trim(),
            type: newVarType,
            scope: newVarScope,
            value: newVarScope === 'constant' || newVarScope === 'variable' ? newVarValue : undefined,
            isDeletable: true,
        };
        setVariables([...variables, newVariable]);
        setNewVarName('');
        setNewVarType('String');
        setNewVarScope('constant');
        setNewVarValue('');
        setIsAdding(false);
    };

    const deleteVariable = (id: string) => {
        setVariables(variables.filter(v => v.id !== id));
    };

    const userVariables = variables.filter(v => v.scope !== 'state');
    const stateVariables = variables.filter(v => v.scope === 'state');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Model State</SheetTitle>
                    <SheetDescription>
                        Define constants and inputs, and inspect the model's state.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                    {!isAdding ? (
                        <Button onClick={() => setIsAdding(true)} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Variable
                        </Button>
                    ) : (
                        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-sm">Add New Variable</h4>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAdding(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="var-name" className="text-xs">Name</Label>
                                    <Input id="var-name" value={newVarName} onChange={(e) => setNewVarName(e.target.value)} placeholder="e.g., ownerAddress" className="h-8 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="var-type" className="text-xs">Type</Label>
                                    <Select value={newVarType} onValueChange={(v: any) => setNewVarType(v)}>
                                        <SelectTrigger id="var-type" className="h-8 text-xs">
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
                            <div className="space-y-1">
                                <Label htmlFor="var-scope" className="text-xs">Scope</Label>
                                <Select value={newVarScope} onValueChange={(v: any) => setNewVarScope(v)}>
                                    <SelectTrigger id="var-scope" className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="constant">Constant</SelectItem>
                                        <SelectItem value="input">Input</SelectItem>
                                        <SelectItem value="variable">Variable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {newVarScope === 'constant' && (
                                <div className="space-y-1">
                                    <Label htmlFor="var-value" className="text-xs">Value</Label>
                                    <Input id="var-value" value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)} placeholder="Enter constant value" className="h-8 text-xs" />
                                </div>
                            )}
                            {newVarScope === 'variable' && (
                                <div className="space-y-1">
                                    <Label htmlFor="var-initial-value" className="text-xs">Initial Value</Label>
                                    <Input id="var-initial-value" value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)} placeholder="Enter initial value" className="h-8 text-xs" />
                                </div>
                            )}
                            <Button onClick={addVariable} size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Confirm
                            </Button>
                        </div>
                    )}
                </div>

                <Separator />

                <ScrollArea className="h-[calc(100vh-16rem)] mt-4">
                    <div className="space-y-4 pr-6">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Read-Only State</h3>
                            <div className="space-y-3">
                                {stateVariables.length === 0 && <p className="text-xs text-center text-muted-foreground pt-2">No state variables defined.</p>}
                                {stateVariables.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                                        <div className="flex items-center space-x-3">
                                            <span className={`w-2.5 h-2.5 rounded-full ${typeColors[v.type]}`}></span>
                                            <div>
                                                <p className="font-mono text-sm font-medium">{v.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {renderStateVariableDescription(v)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Variables, Constants and Inputs</h4>
                            <div className="space-y-3">
                                {userVariables.length === 0 && <p className="text-xs text-center text-muted-foreground pt-2">No variables defined.</p>}
                                {userVariables.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <span className={`w-2.5 h-2.5 rounded-full ${typeColors[v.type]}`}></span>
                                            <div>
                                                <p className="font-mono text-sm font-medium">{v.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {v.type} - <span className="capitalize">{v.scope}</span>
                                                    {(v.scope === 'constant' || v.scope === 'variable') && v.value && <span className="font-mono text-xs"> = {v.value}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        {v.isDeletable !== false &&
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteVariable(v.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
