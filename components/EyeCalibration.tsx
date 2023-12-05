"use client";

import { Dialog } from "@headlessui/react";
import { XIcon } from "lucide-react";
import { useState } from "react";

interface eyeCalibrationProps {
  setCalibrationOpen: (isOpen: boolean) => void;
}

// read only array
const calibrationStep = [
  "topLeft",
  "topRight",
  "bottomRight",
  "bottomLeft",
  "middle",
] as const;

type CalibrationStep = typeof calibrationStep[number];

const EyeCalibration = ({ setCalibrationOpen }: eyeCalibrationProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const nextStep = () => {
    if (currentStepIndex < calibrationStep.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCalibrationOpen(false); // Close the calibration when all steps are done
    }
  };

  const calibrationStepToDotProps = (step: CalibrationStep): {} => {
    switch (step) {
      case "topLeft":
        return { top: '60px', left: '60px' };
      case "topRight":
        return { top: '60px', right: '60px' };
      case "bottomRight":
        return { bottom: '60px', right: '60px' };
      case "bottomLeft":
        return { bottom: '60px', left: '60px' };
      case "middle":
        return { top: '50%', left: '50%' };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen px-4 text-center z-50">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

      <span className="inline-block h-screen align-middle" aria-hidden="true">
        &#8203;
      </span>

      <div className="inline-block w-screen h-screen p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
        <Dialog.Title
          as="h3"
          className="text-2xl font-bold leading-6 text-gray-900"
        >
          Eye Calibration
        </Dialog.Title>


        <Dot {...calibrationStepToDotProps(calibrationStep[currentStepIndex])} onClick={nextStep} />


        <button
          type="button"
          className="absolute top-4 right-4 inline-flex justify-center px-2 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => setCalibrationOpen(false)}
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

interface DotProps {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    onClick?: () => void;
  }
  
  const Dot: React.FC<DotProps> = ({ top, right, bottom, left, onClick }) => {
    return (
      <div
        className="absolute bg-blue-500 rounded-full"
        onClick={onClick}
        style={{
          width: '40px',
          height: '40px',
          top: top,
          right: right,
          bottom: bottom,
          left: left,
        }}
      ></div>
    );
  };

export default EyeCalibration;
