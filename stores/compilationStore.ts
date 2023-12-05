import { create } from "zustand";


export enum CompilationStatus {
    'NOT_STARTED',
    'IN_PROGRESS',
    'SUCCESS',
    'ERROR'
}

type CompilationState = {
  compilationStatus: CompilationStatus;
  setCompilationStatus: (newCompilation: CompilationStatus) => void;
  output: string;
  setOutput: (newOutput: string) => void;
  runtime: string;
  setRuntime: (newRuntime: string) => void;
  setCorrectOutput: (newCorrectOutput: string) => void;
  correctOutput: string;
};


export const useCompilationStore = create<CompilationState>((set) => ({
  compilationStatus: CompilationStatus.NOT_STARTED,
  setCompilationStatus: (newCompilation: CompilationStatus) => set(() => ({ compilationStatus: newCompilation })),
  output: "",
  setOutput: (newOutput: string) => set(() => ({ output: newOutput })),

  runtime: "",
  setRuntime: (newRuntime: string) => set(() => ({ runtime: newRuntime })),
  setCorrectOutput: (newCorrectOutput: string) => set(() => ({ correctOutput: newCorrectOutput })),
  correctOutput: "",
}))



