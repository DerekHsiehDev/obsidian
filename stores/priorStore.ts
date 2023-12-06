// priors include resume text and github information

import { create } from "zustand";

type PriorState = {
  resume: string;
  setResume: (newResume: string) => void;

  githubCommits: any;
  setGithubCommits: (newCommits: any) => void;

  githubDailyCommits: any;
  setGithubDailyCommits: (newCommits: any) => void;

  setMedianMeanVariance: (newMedianMeanVariance: any) => void;

  medianMeanVariance: any;
};

export const usePriorStore = create<PriorState>((set) => ({
  resume: "",
  setResume: (newResume: string) => set(() => ({ resume: newResume })),
  
  githubCommits: [
    ["Day", "Forcasted",  "Commits"],
    [0, 0, 0],
  ],
  setGithubCommits: (newCommits: any) =>
    set(() => ({ githubCommits: newCommits })),
  
  githubDailyCommits: [
    ["Day", "Commits"],
    [0, 0],
  ],
  setGithubDailyCommits: (newCommits: any) =>
    set(() => ({ githubDailyCommits: newCommits })),
  
  medianMeanVariance: [{
    median: 0,
    mean: 0,
    variance: 0,
  }],
  setMedianMeanVariance: (newMedianMeanVariance: any) =>
    set(() => ({ medianMeanVariance: newMedianMeanVariance })),
}));
