// priors include resume text and github information

import { createStore } from "zustand";

type PriorState = {
  resume: string;
  setResume: (newResume: string) => void;
};

export const usePriorStore = createStore<PriorState>((set) => ({
  resume: "",
  setResume: () => set((state) => ({ resume: state.resume })),
}));
