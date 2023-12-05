"use client";

import Button from "./Button";
import speechToText from "@/utils/speechClient";
import CodeEditor from "./CodeEditor";
import codeCompilationClient from "@/utils/compileClient";
import { useState } from "react";
import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import CodeConsole from "./CodeConsole";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  CompilationStatus,
  useCompilationStore,
} from "@/stores/compilationStore";
import { useStore } from "zustand";
import { CheckCircle } from "lucide-react";

const data = {
  text: "We'll start with a brief overview of your experience and skills, and then proceed to some technical questions related to your field. Please feel free to ask any questions or seek clarifications at any point.",
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
    userResult: string;
    correctResult: string;
    executionTime: string;
  };
}

const prompt = `
<ul class="list-disc list-inside">
  <li class="mb-1">Use TypeScript to create a class that interacts with the API endpoint <b>https://interview-api-pi.vercel.app/api/users</b> through a <b>GET</b> request using <b>fetch</b>, NOT axios.</li>
  <li class="mb-1">Your class should include properly defined types for the API response and a method to perform the request.</li>
  <li class="mb-1">You need to execute this request three times, storing the results in an array within the class.</li>
  <li class="mb-1">After all requests are completed, output the array contents using <b>console.log</b>.</li>
  <li class="mb-1">Make sure to handle potential errors appropriately during the request execution and output them using <b>console.error</b>.</li>
</ul>
`;

const ChatContent = () => {
  const [currentCode, setCurrentCode] = useState("");

  const [isPromptVisible, setPromptVisible] = useState(true);

  const [isErrorSubmitOpen, setIsErrorSubmitOpen] = useState(false);

  const togglePrompt = () => {
    setPromptVisible(!isPromptVisible);
  };

  const {
    output,
    setOutput,
    setRuntime,
    setCompilationStatus,
    correctOutput,
    setCorrectOutput,
  } = useCompilationStore();

  const handleEditorChange = (newCode: string | undefined) => {
    if (newCode) {
      setCurrentCode(newCode);
    }
  };

  const handleSubmit = () => {
    if (output !== correctOutput || !correctOutput) {
      setIsErrorSubmitOpen(true);
      return
    } 

    // success
    alert("Success! You can now move on to the next question.")
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
    setOutput(JSON.stringify(response.data!.userResult, null, 4));
    setCorrectOutput(JSON.stringify(response.data!.correctResult, null, 4));
    setRuntime(response.data!.executionTime);
  };

  const cleanPrompt = (prompt: string) => {
    // Split the prompt by backticks
    const parts = prompt.split("`");

    // Map over the parts and wrap every second part in a <b> tag
    const elements = parts.map((part, index) =>
      index % 2 === 0 ? part : <b key={index}>{part}</b>
    );

    return <div dangerouslySetInnerHTML={{ __html: prompt }} />;
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

        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={handleSubmit}
        >
          <CheckCircle className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Submit
        </button>
      </div>
      <CodeEditor onChange={handleEditorChange} />

      <CodeConsole />

      <AlertDialog open={isErrorSubmitOpen} onOpenChange={setIsErrorSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Incorrect Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Your output did not match the expected output. Please try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatContent;
