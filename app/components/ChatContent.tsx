"use client";

import Button from "./Button";
import speechToText from "@/utils/speechClient";
import CodeEditor from "./CodeEditor";
import codeCompilationClient from "@/utils/compileClient";
import { useState } from "react";
import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import CodeConsole from "./CodeConsole";
import {
  CompilationStatus,
  useCompilationStore,
} from "@/stores/compilationStore";
import { useStore } from "zustand";

const data = {
  text: "Hello, my name is Derek, and I'll be conducting your technical interview today. We'll start with a brief overview of your experience and skills, and then proceed to some technical questions related to your field. Please feel free to ask any questions or seek clarifications at any point.",
};

interface Error {
  message: string;
  code: string | undefined;
  statusCode: number | undefined;
  statusText: string | undefined;
  details: any;
}

interface Response {
  success: boolean;
  error?: Error;
  data?: {
    result: string;
    executionTime: string;
  };
}

const prompt =
  "use TypeScript to create a class that interacts with the API endpoint `https://vertix.dev/api/users` through a `GET` request using `fetch`, NOT axios. Your class should include properly defined types for the API response and a method to perform the request. You need to execute this request three times, storing the results in an array within the class. After all requests are completed, output the array contents using `console.log`.";

const ChatContent = () => {
  const [currentCode, setCurrentCode] = useState("");

  const [isPromptVisible, setPromptVisible] = useState(true);

  const togglePrompt = () => {
    setPromptVisible(!isPromptVisible);
  };

  const { output, setOutput, setRuntime, setCompilationStatus } =
    useCompilationStore();

  const handleEditorChange = (newCode: string | undefined) => {
    if (newCode) {
      setCurrentCode(newCode);
    }
  };

  const handleCompile = async () => {
    setCompilationStatus(CompilationStatus.IN_PROGRESS);

    console.log("handleCompile started"); // New log
    const response: Response = await codeCompilationClient(currentCode);
    if (!response.success) {
      setCompilationStatus(CompilationStatus.ERROR);
      if (response.error && response.error.details) {
        setOutput(response.error.details.details as string);
      } else {
        setOutput("An unknown error occurred during compilation.");
      }
      return;
    }

    setCompilationStatus(CompilationStatus.SUCCESS);
    // data is never null when success is true
    setOutput(JSON.stringify(response.data!.result, null, 4));
    setRuntime(response.data!.executionTime);
  };

  const cleanPrompt = (prompt: string) => {
    // Split the prompt by backticks
    const parts = prompt.split("`");

    // Map over the parts and wrap every second part in a <b> tag
    const elements = parts.map((part, index) =>
      index % 2 === 0 ? part : <b key={index}>{part}</b>
    );

    return <div>{elements}</div>;
  };

  const handlePlayAudio = () => {
    speechToText(data.text);
  };

  return (
    <div className="flex flex-col justify-between items-center h-full overflow-auto">
      <button
        className="mt-3 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        onClick={togglePrompt}
      >
        {isPromptVisible ? "Minimize Prompt" : "Maximize Prompt"}
      </button>
      {isPromptVisible && (
        <div className="text-sm m-3">{cleanPrompt(prompt)}</div>
      )}
      <div className="p-3 mr-auto flex flex-row justify-between items-center w-full">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleCompile}
        >
          <RocketLaunchIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Compile Code
        </button>
      </div>
      <CodeEditor onChange={handleEditorChange} />

      <CodeConsole />
    </div>
  );
};

export default ChatContent;
