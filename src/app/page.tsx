
'use client';

import { useState, ChangeEvent, useRef } from 'react';
import FlowCanvas from '@/components/visual-flow/FlowCanvas';
import ProjectSelectionDialog from '@/components/visual-flow/ProjectSelectionDialog';
import { Node, Edge } from 'reactflow';
import { Variable } from '@/components/visual-flow/VariablesSheet';

export default function Home() {
  const [project, setProject] = useState<{
    name: string;
    initialNodes: Node[];
    initialEdges: Edge[];
    initialVariables: Variable[];
  } | null>(null);

  const handleProjectSelected = (selectedProject: { name: string; initialNodes?: Node[]; initialEdges?: Edge[], initialVariables?: Variable[] }) => {
    setProject({
      name: selectedProject.name,
      initialNodes: selectedProject.initialNodes || [],
      initialEdges: selectedProject.initialEdges || [],
      initialVariables: selectedProject.initialVariables || [],
    });
  };

  return (
    <main className="h-screen w-screen bg-background relative">
      {!project ? (
        <>
          <ProjectSelectionDialog onProjectSelected={handleProjectSelected} />
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm pointer-events-none" />
        </>
      ) : (
        <FlowCanvas
          projectName={project.name}
          initialNodes={project.initialNodes}
          initialEdges={project.initialEdges}
          initialVariables={project.initialVariables}
        />
      )}
    </main>
  );
}
