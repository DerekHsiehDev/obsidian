import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircleIcon } from "lucide-react";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const PriorDialog = () => {
  const [username, setUsername] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  const handleSubmit = async () => {
    const response = await fetch(`/api/github?userName=${username.trim()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("HTTP error", response.status);
    } else {
      const contributionRes = await response.json();
      console.log(contributionRes.data.user.contributionsCollection);
    }

    console.log(fileContent);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="ml-6 inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
          Reset Priors
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your resume and GitHub</DialogTitle>
          <DialogDescription>
            <div>
              <label
                htmlFor="github username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                GitHub username
              </label>
              <div className="mt-2">
                <input
                  name="github username"
                  id="github-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="derekhsiehdev"
                />
              </div>
            </div>
            <label
              htmlFor="resume-content"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Resume Text Content
            </label>
            <div className="mt-2 mb-2">
              <textarea
                name="resume-content"
                id="resume-content"
                value={fileContent}
                onChange={(event) => setFileContent(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your resume content here"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!username || fileContent.length === 0}
                className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  !username || fileContent.length === 0
                    ? "bg-indigo-300"
                    : "bg-indigo-600"
                }`}
                onClick={handleSubmit}
              >
                <CheckCircleIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
                Finish
              </button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const Dropzone = ({ files, setFiles }: { files: any; setFiles: any }) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
    // Handle file upload here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto p-4">
      <div
        {...getRootProps()}
        className="border-dashed border-4 border-gray-200 py-12 px-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-500">Drop the files here...</p>
        ) : (
          <p className="text-gray-500">Add your most recent resume here.</p>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="text-gray-700">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PriorDialog;
