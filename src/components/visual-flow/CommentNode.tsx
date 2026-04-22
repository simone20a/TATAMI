"use client";

import { memo } from 'react';
import { NodeProps, NodeResizer, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StickyNote } from 'lucide-react';

function CommentNode({ id, data, selected }: NodeProps<{ label?: string, text?: string }>) {
  const { setNodes } = useReactFlow();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, text: newText } };
        }
        return node;
      })
    );
  };

  return (
    <>
      <NodeResizer 
        color="#fde047" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={100} 
      />
      <Card className="w-full h-full bg-[#fef08a] shadow-lg border-[#fde047] border rounded-lg">
        <CardHeader className="flex flex-row items-center space-x-3 p-2 pb-0">
          <StickyNote className="w-4 h-4 text-[#854d0e]" />
          <CardTitle className="text-sm font-semibold text-[#854d0e]">{data.label || 'Comment'}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-1 h-[calc(100%-32px)] text-sm">
            <textarea
              className="w-full h-full bg-transparent border-none resize-none outline-none focus:ring-0 text-[#854d0e] placeholder:text-[#a16207]"
              placeholder="Add your notes here..."
              value={data.text || ""}
              onChange={handleTextChange}
              onMouseDown={(e) => e.stopPropagation()}
            />
        </CardContent>
      </Card>
    </>
  );
}

export default memo(CommentNode);
