import React from "react";
import FloatingParticles from "./components/ui/FloatingParticles";
import Logo from "./components/ui/Logo";
import Headers from "./components/ui/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Entry = {
  imageUrl: string;
  description: string;
  date: string;
  object: string;
};

const sampleData: Entry[] = [
  {
    imageUrl: "/samples/art1.png",
    description: "A majestic eagle made from a stone.",
    date: "2025-07-14",
    object: "Stone",
  },
  {
    imageUrl: "/samples/art2.png",
    description: "A fluffy cat formed out of a shell rock.",
    date: "2025-07-13",
    object: "Shell Rock",
  },
  // Add more items here
];

export default function GalleryPage() {
  return (
    <>
      <FloatingParticles />
      <Headers />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-5xl mx-auto">
          <header className="mb-10">
            <Logo currentStep={1} />
            <h1 className="text-center text-3xl font-bold text-white mt-4">Your AI Animal Art Gallery</h1>
            <p className="text-center text-gray-400 mt-2">Browse your generated images with their descriptions</p>
          </header>

          <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sampleData.map((entry, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-xl text-white hover:scale-[1.02] transition-transform"
              >
                <img
                  src={entry.imageUrl}
                  alt={entry.description}
                  className="rounded-xl w-full h-48 object-cover mb-4"
                />
                <h2 className="font-semibold text-lg mb-2">{entry.object}</h2>
                <p className="text-sm text-gray-300 mb-1">{entry.description}</p>
                <p className="text-xs text-gray-500">{new Date(entry.date).toDateString()}</p>
              </div>
            ))}
          </main>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="dark"
        hideProgressBar={false}
        pauseOnHover
      />
    </>
  );
}
