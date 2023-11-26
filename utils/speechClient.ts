"use client"

import { BASE_URL } from "@/lib/constants";
import axios from "axios";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const AudioContext: typeof window.AudioContext = window.AudioContext || window.webkitAudioContext;
const globalAudioContext = new AudioContext();

const speechToText = async (text: string) => {
  const data = { text };

  try {
    const response = await axios.post(BASE_URL + "/api/speech", data, {
      responseType: "arraybuffer",
    });

    const buffer = await globalAudioContext.decodeAudioData(response.data);
    const source = globalAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(globalAudioContext.destination);
    source.start(0);
  } catch (error) {
    console.error(error);
  }
};

export default speechToText;
