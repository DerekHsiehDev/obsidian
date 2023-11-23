"use client";

import Button from "./Button";
import speechToText from "@/utils/speechClient";
import CodeEditor from "./CodeEditor";

const data = {
  text: "Hello, my name is Derek, and I'll be conducting your technical interview today. We'll start with a brief overview of your experience and skills, and then proceed to some technical questions related to your field. Please feel free to ask any questions or seek clarifications at any point.",
};

const ChatContent = () => {
  const handlePlayAudio = () => {
    speechToText(data.text);
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      {/* <Button
        onClick={handlePlayAudio}
        text={"Play audio"}
        classNames="bg-indigo-600 "
      /> */}

    <CodeEditor/>
    </div>
  );
};

export default ChatContent;
