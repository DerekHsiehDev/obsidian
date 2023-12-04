import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const PriorDialog = () => {
  async function fetchGitHubRepos(username:string) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = await response.json();
    console.log(repos)
  }

  useEffect(() => {

    fetchGitHubRepos("derekhsiehdev")

  }, [])

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
            <Dropzone />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const Dropzone = () => {
  const [files, setFiles] = useState<File[]>([]);

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
          <p className="text-gray-500">Add your most recent resune here.</p>
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
