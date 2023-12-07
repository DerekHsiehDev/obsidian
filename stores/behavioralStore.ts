import { create } from "zustand";

const welcomeSpeech =
  "Welcome to your interview! This will be a brief 10 minute long interview where we'll go over project experience and a coding question, you can use the internet and GPT located on the right of the screen.";


type BehavioralState = {
    currentInterviewPrompt: string;
    setCurrentInterviewPrompt: (newPrompt: string) => void;

    similarityScore: number[];
    appendSimilarityScore: (newScore: number) => void;
}

export const useBehavioralStore = create<BehavioralState>((set) => ({
    currentInterviewPrompt: welcomeSpeech,
    setCurrentInterviewPrompt: (newPrompt: string) => set((state) => ({ currentInterviewPrompt: newPrompt })),
    similarityScore: [],

    appendSimilarityScore: (newScore: number) => set((state) => ({ similarityScore: [...state.similarityScore, newScore] }))

}))

