import { create } from 'zustand';

type DataState = {
    currentEyeTrackingState: "chat" | "video" | "stats";
    setCurrentEyeTrackingState: (newState: "chat" | "video" | "stats") => void;
}

export const useDataStore = create<DataState>((set) => ({
    currentEyeTrackingState: "chat",
    setCurrentEyeTrackingState: (newState: "chat" | "video" | "stats") => set((state) => ({currentEyeTrackingState: newState}))
}))
