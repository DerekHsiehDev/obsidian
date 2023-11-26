"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// @ts-ignore -> need to ignore bc webgazer written in js
const WebGazerNoSSR = dynamic(() => import("webgazer"), { ssr: false });

function VideoContent() {
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const loadWebgazer = async () => {
      const webgazer = (await import("webgazer")).default;
      window.webgazer = webgazer;
      await window.webgazer.begin();

      let counter = 0;
      // process every nth prediction
      const nthPrediction = 25;

      window.webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data == null) {
            return;
          }
          counter++;
          if (counter % nthPrediction === 0) {
            console.log(elapsedTime, data); // data is an object containing an x and y property which are the x and y prediction coordinates (no bounds limiting)
          }
        })
        .begin();

      window.webgazer.showPredictionPoints(showPoints);
    };
    loadWebgazer();
  }, []);

  const togglePoints = () => {
    setShowPoints(!showPoints);
    window.webgazer.showPredictionPoints(showPoints);
  };

  return (
    <button onClick={togglePoints} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {showPoints ? "Hide" : "Show"} Prediction Points
    </button>
  )
}

export default VideoContent;




  