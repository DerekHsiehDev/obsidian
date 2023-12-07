"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import StatsGraphView from "./StatsGraphView";
import { usePriorStore } from "@/stores/priorStore";
import ContributionChart from "./ContributionChart";
import Barchart from "./MeanChart";

enum Tab {
  stats = "stats",
  web = "web",
  gpt = "gpt",
}

const StatsContent = () => {

  const {similarityScore} = useBehavioralStore()
  const { githubCommits, githubDailyCommits, medianMeanVariance } =
    usePriorStore();
  return (
    <Tabs defaultValue={Tab.stats} className=" pt-3 w-full">
      <TabsList>
        <TabsTrigger value={Tab.stats}>Stats</TabsTrigger>
        <TabsTrigger value={Tab.web}>Web</TabsTrigger>
        <TabsTrigger value={Tab.gpt}>GPT</TabsTrigger>
      </TabsList>
      <TabsContent value={Tab.stats}>
        <div className="flex flex-col overflow-auto h-96 overflow-y-auto">
          <div className="font-bold">GitHub Stats</div>
          <div className="w-full">
            <StatsGraphView combinedData={githubCommits} />
          </div>
          <div className="w-full flex justify-center">
            <Barchart data={medianMeanVariance} />
          </div>
          <div className="font-bold">Interview talking Stats</div>
          <BehavioralChart chartData={similarityScore} />
        </div>
      </TabsContent>
      <TabsContent value={Tab.web} className="w-full">
        <iframe
          src="https://www.bing.com"
          style={{ width: "100%", height: "100vh" }}
        ></iframe>
      </TabsContent>
      <TabsContent value={Tab.gpt}>
        <IMessageUI />
      </TabsContent>
    </Tabs>
  );
};

type Role = "assistant" | "user";

interface Message {
  content: string;
  role: Role;
}

function IMessageUI() {
  const [input, setInput] = useState<string>("");

  const [isGPTTyping, setIsGPTTyping] = useState<boolean>(false);

  const handleGPT = (messages: Message[]) => {
    // remove first message
    fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.slice(1),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.text);
        const newMessage: Message = {
          content: data.text,
          role: "assistant",
        };
        setMessages([...messages, newMessage]);
        setIsGPTTyping(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsGPTTyping(false);
      });
  };

  const handleNewMessage = () => {
    if (input === "") {
      return;
    }

    const newMessage: Message = {
      content: input,
      role: "user",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      console.log(newMessage);
      setInput("");
      handleGPT(updatedMessages);
      return updatedMessages;
    });
  };

  function formatMessageContent(content: string) {
    return (
      <>
        {content.split("```").map((part, index) =>
          index % 2 === 0 ? (
            <p key={index}>{part}</p>
          ) : (
            <pre
              key={index}
              className="text-sm mt-3 text-green-400 font-mono bg-gray-800 p-4 rounded"
            >
              {/* cuts off first line which is programming language */}
              <code>{part.split("\n").slice(1).join("\n")}</code>
            </pre>
          )
        )}
      </>
    );
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      content:
        "I'm here to help you remember syntax, and find the right resources. Not to give you the answers!",
      role: "assistant",
    },
  ]);

  return (
    <div className="w-full rounded-lg overflow-hidden mr-4">
      <div
        className="bg-white p-4 pr-3 flex-grow overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="space-y-2">
          <div className="mb-7">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "user" ? "flex justify-end" : ""
                } mb-3`}
              >
                <div
                  className={`${
                    message.role === "user" ? "bg-blue-500" : "bg-gray-100"
                  } p-2 rounded-lg inline-block`}
                >
                  <p
                    className={`text-sm ${
                      message.role === "user" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {formatMessageContent(message.content)}
                  </p>
                </div>
              </div>
            ))}
            {isGPTTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-2 pt-3 pb-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="mx-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                    </div>
                    <div className="mx-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <div className="mx-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-225"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-1/2 flex items-center bg-white rounded-full p-2">
        <input
          type="text"
          className="flex-grow rounded-full px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-400"
          placeholder="Type a message..."
          value={input}
          disabled={isGPTTyping}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleNewMessage();
            }
          }}
        />
        <div className="ml-2">
          <button onClick={handleNewMessage}>
            <ArrowUpCircleIcon
              className="h-8 w-8 text-blue-500"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Chart } from "react-google-charts";
import { useBehavioralStore } from "@/stores/behavioralStore";

const BehavioralChart = ({ chartData }) => {
  const data = [
    ["Question", "Similarity to Source of Truth"],
    ...chartData.map((similarity, index) => [
      `Question ${index + 1}`,
      similarity,
    ]),
  ];

  return (
    <Chart
      width={"500px"}
      height={"300px"}
      chartType="Table"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        showRowNumber: true,
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );
};

export default StatsContent;
