
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Type, Hash, AtSign, Binary, Spline, Coins, Flame, GitMerge, GitBranch, CircleDollarSign, Diamond, Box, ArrowDownToLine, ArrowUpFromLine, Send, LogIn, AlertTriangle, Pencil, StickyNote } from "lucide-react";

type ContextMenuProps = {
    top: number;
    left: number;
    onClick: (type: string) => void;
};

const nodeOptions = [
    { type: 'entryNode', label: 'Entry', icon: <LogIn className="mr-2 h-4 w-4" /> },
    { type: 'splitNode', label: 'Split', icon: <Spline className="mr-2 h-4 w-4" /> },
    { type: 'mintNode', label: 'Mint', icon: <Coins className="mr-2 h-4 w-4" /> },
    { type: 'burnNode', label: 'Burn', icon: <Flame className="mr-2 h-4 w-4" /> },
    { type: 'exceptionNode', label: 'Exception', icon: <AlertTriangle className="mr-2 h-4 w-4" /> },
    { type: 'joinNode', label: 'Join', icon: <GitMerge className="mr-2 h-4 w-4" /> },
    { type: 'ifNode', label: 'If', icon: <GitBranch className="mr-2 h-4 w-4" /> },
    { type: 'depositNode', label: 'Deposit', icon: <ArrowDownToLine className="mr-2 h-4 w-4" /> },
    { type: 'withdrawNode', label: 'Withdraw', icon: <ArrowUpFromLine className="mr-2 h-4 w-4" /> },
    { type: 'transferNode', label: 'Transfer', icon: <Send className="mr-2 h-4 w-4" /> },
    { type: 'setNode', label: 'Set', icon: <Pencil className="mr-2 h-4 w-4" /> },
];

const typeNodeOptions = [
    { type: 'booleanNode', label: 'Boolean', icon: <Binary className="mr-2 h-4 w-4" /> },
    { type: 'numberNode', label: 'Number', icon: <Hash className="mr-2 h-4 w-4" /> },
    { type: 'addressNode', label: 'Address', icon: <AtSign className="mr-2 h-4 w-4" /> },
    { type: 'stringNode', label: 'String', icon: <Type className="mr-2 h-4 w-4" /> },
];

const independentElementsOptions = [
    { type: 'fungibleTokenNode', label: 'Fungible Token', icon: <CircleDollarSign className="mr-2 h-4 w-4" /> },
    { type: 'nonFungibleTokenNode', label: 'Non-Fungible Token', icon: <Diamond className="mr-2 h-4 w-4" /> },
    { type: 'poolNode', label: 'Pool', icon: <Box className="mr-2 h-4 w-4" /> },
]

export default function ContextMenu({ top, left, onClick }: ContextMenuProps) {
    return (
        <div style={{ top, left }} className="absolute z-50">
            <Card className="w-56 bg-popover shadow-lg border-border animate-in fade-in-0 zoom-in-95">
                <CardContent className="p-1">
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="flow-blocks" className="border-b-0">
                            <AccordionTrigger className="py-2 text-sm hover:no-underline">Flow Blocks</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col space-y-0.5">
                                    {nodeOptions.map(({ type, label, icon }) => (
                                        <Button
                                            key={type}
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs h-7"
                                            onClick={() => onClick(type)}
                                        >
                                            {icon}
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="type-blocks" className="border-b-0">
                            <AccordionTrigger className="py-2 text-sm hover:no-underline">Type Blocks</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col space-y-0.5">
                                    {typeNodeOptions.map(({ type, label, icon }) => (
                                        <Button
                                            key={type}
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs h-7"
                                            onClick={() => onClick(type)}
                                        >
                                            {icon}
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="independent-elements" className="border-b-0">
                            <AccordionTrigger className="py-2 text-sm hover:no-underline">Independent Elements</AccordionTrigger>
                            <AccordionContent className="pb-1">
                                <div className="flex flex-col space-y-0.5">
                                    {independentElementsOptions.map(({ type, label, icon }) => (
                                        <Button
                                            key={type}
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs h-7"
                                            onClick={() => onClick(type)}
                                        >
                                            {icon}
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="mt-1 pt-1 border-t border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-7"
                            onClick={() => onClick('commentNode')}
                        >
                            <StickyNote className="mr-2 h-4 w-4" />
                            Comment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
