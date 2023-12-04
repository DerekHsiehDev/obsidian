"use client"
import ChatContent from "./components/ChatContent";
import Navbar from "./components/Navbar";
import StatsContent from "./components/StatsContent";
import VideoContent from "./components/VideoContent";

export default function Home() {
  return (
  <main className="flex flex-col max-h-screen h-screen overflow-hidden">
        <Navbar />
      <div className="flex flex-row flex-1 h-full">
        <div className="w-1/2">
        <ChatContent/>
        </div>
        <div className="w-1/2 h-4/6 flex flex-col">
          <div className="flex-1 bg-gray-200 rounded-md">
            <VideoContent/>
          </div>
          <div className="flex-1 h-5/7">
            <StatsContent/>
          </div>
        </div>
      </div>
    </main>
  );
}