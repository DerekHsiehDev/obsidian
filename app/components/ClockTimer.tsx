import React, { useState, useEffect } from "react";

const ClockTimer = () => {
  const [time, setTime] = useState(10 * 60);

  const [selectedDisplay, setSelectedDisplay] = useState<"precise" | "calm">(
    "precise"
  );

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);

    if(time <= 3 * 60) {
        setSelectedDisplay("precise");
    }

    // @ts-ignore
    return () => clearInterval(timer);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="ml-4 flex items-center justify-center space-x-4">
      <button
        onClick={() => setSelectedDisplay("precise")}
        className={`px-4 py-2 rounded transform transition-transform duration-500 ${
          selectedDisplay === "precise"
            ? "text-white bg-blue-500 scale-110"
            : "text-gray-500 bg-blue-300 text-sm scale-100"
        }`}
      >
        Precise
      </button>
      <div className="text-center text-4xl font-mono">
        {minutes.toString().padStart(2, "0")}:
        {selectedDisplay === "precise" ? seconds.toString().padStart(2, "0") : "xx"}
      </div>
      <button
        onClick={() => setSelectedDisplay("calm")}
        className={`px-4 py-2 rounded transform transition-transform duration-500 ${
          selectedDisplay === "calm"
            ? "text-white bg-green-500 scale-110"
            : "text-gray-500 bg-green-300 text-sm scale-100"
        }`}
      >
        Calm
      </button>
    </div>
  );
};

export default ClockTimer;
