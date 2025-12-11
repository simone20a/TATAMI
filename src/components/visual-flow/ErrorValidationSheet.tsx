
"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle } from "lucide-react";

export type ValidationError = {
    id: string;
    message: string;
};

interface ErrorValidationSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    errors: ValidationError[];
}

export default function ErrorValidationSheet({ open, onOpenChange, errors }: ErrorValidationSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Model Validation</SheetTitle>
                    <SheetDescription>
                        {errors.length === 0 
                            ? "No errors found in your model."
                            : "The following errors were found in your model. Please fix them to ensure correctness."
                        }
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4">
                   {errors.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <p className="font-semibold">Validation Successful!</p>
                        <p className="text-sm">Your model is looking good.</p>
                     </div>
                   ) : (
                    <div className="space-y-3">
                        {errors.map(error => (
                            <div key={error.id} className="flex items-start p-3 border border-destructive/50 rounded-md bg-destructive/10">
                                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 text-destructive shrink-0" />
                                <p className="text-sm text-destructive-foreground">{error.message}</p>
                            </div>
                        ))}
                    </div>
                   )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

    