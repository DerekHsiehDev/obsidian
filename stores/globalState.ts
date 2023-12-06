import { create } from "zustand";

type GlobalState = {
  hasAddedPrior: boolean;
  setHasAddedPrior: (newHasAddedPrior: boolean) => void;
  hasDoneEyeTracking: boolean;
  setHasDoneEyeTracking: (newHasDoneEyeTracking: boolean) => void;

  openEyeTracking: boolean;
  setOpenEyeTracking: (newOpenEyeTracking: boolean) => void;
};

export const useGlobalState = create<GlobalState>((set) => ({
  hasAddedPrior: false,
  setHasAddedPrior: (newHasAddedPrior: boolean) =>
    set((state) => ({ ...state, hasAddedPrior: newHasAddedPrior })),
  hasDoneEyeTracking: false,
  setHasDoneEyeTracking: (newHasDoneEyeTracking: boolean) =>
    set((state) => ({ ...state, hasDoneEyeTracking: newHasDoneEyeTracking })),
  openEyeTracking: false,
  setOpenEyeTracking: (newOpenEyeTracking: boolean) => set((state) => ({ ...state, openEyeTracking: newOpenEyeTracking }))
}));