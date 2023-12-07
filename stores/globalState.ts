import { create } from "zustand";

type GlobalState = {
  hasAddedPrior: boolean;
  setHasAddedPrior: (newHasAddedPrior: boolean) => void;
  hasDoneEyeTracking: boolean;
  setHasDoneEyeTracking: (newHasDoneEyeTracking: boolean) => void;

  openEyeTracking: boolean;
  setOpenEyeTracking: (newOpenEyeTracking: boolean) => void;

  questionsAndAnswers: any[];
  setQuestionsAndAnswers: (newQuestionsAndAnswers: any[]) => void;

  timeSpentOnChatAndTools: {
    chat: number;
    tools: number;
  };

  incrementTimeSpendOnChatAndTools: (location: "chat" | "tools") => void;

  isCodeProblemOpen: boolean;
  setIsCodeProblemOpen: (newIsCodeProblemOpen: boolean) => void;
};

export const useGlobalState = create<GlobalState>((set) => ({
  hasAddedPrior: false,
  setHasAddedPrior: (newHasAddedPrior: boolean) =>
    set((state) => ({ ...state, hasAddedPrior: newHasAddedPrior })),
  hasDoneEyeTracking: false,
  setHasDoneEyeTracking: (newHasDoneEyeTracking: boolean) =>
    set((state) => ({ ...state, hasDoneEyeTracking: newHasDoneEyeTracking })),
  openEyeTracking: false,
  setOpenEyeTracking: (newOpenEyeTracking: boolean) =>
    set((state) => ({ ...state, openEyeTracking: newOpenEyeTracking })),

  questionsAndAnswers: [],
  setQuestionsAndAnswers: (newQuestionsAndAnswers: any[]) =>
    set((state) => ({ ...state, questionsAndAnswers: newQuestionsAndAnswers })),
  timeSpentOnChatAndTools: {
    chat: 0,
    tools: 0,
  },

  incrementTimeSpendOnChatAndTools: (location: "chat" | "tools") => {
    if (location === "chat") {
      set((state) => ({
        ...state,
        timeSpentOnChatAndTools: {
          ...state.timeSpentOnChatAndTools,
          chat: state.timeSpentOnChatAndTools.chat + 1,
        },
      }));
    } else {
      set((state) => ({
        ...state,
        timeSpentOnChatAndTools: {
          ...state.timeSpentOnChatAndTools,
          tools: state.timeSpentOnChatAndTools.tools + 1,
        },
      }));
    }
  },

  isCodeProblemOpen: false,
  setIsCodeProblemOpen: (newIsCodeProblemOpen: boolean) =>
    set((state) => ({ ...state, isCodeProblemOpen: newIsCodeProblemOpen })),
}));
