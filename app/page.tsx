import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* <nav className="p-4"> */}
        <Navbar />
      {/* </nav> */}
      <div className="flex flex-row flex-1">
        <div className="w-1/2 bg-gray-300">chat content</div>
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 bg-gray-400">video content</div>
          <div className="flex-1 bg-gray-200">stats content</div>
        </div>
      </div>
    </main>
  );
}