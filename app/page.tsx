"use client"
import ChatContent from "./components/ChatContent";
import Navbar from "./components/Navbar";
import VideoContent from "./components/VideoContent";

export default function Home() {
  return (
  <main className="flex flex-col max-h-screen h-screen overflow-hidden">
        <Navbar />
      <div className="flex flex-row flex-1 h-full">
        <div className="w-1/2">
        <ChatContent/>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 bg-gray-400">
            <VideoContent/>
          </div>
          <div className="flex-1 bg-gray-200">stats content</div>
        </div>
      </div>
    </main>
  );
}