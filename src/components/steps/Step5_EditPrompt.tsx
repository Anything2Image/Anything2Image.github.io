import React from "react";
import LoadingOverlay from "../ui/LoadingOverlay";

// New SVG Icon for Microphone
const MicrophoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
    <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
  </svg>
);

export interface Step5EditPromptProps {
  editedPrompt: string;
  setEditedPrompt: (value: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onStartGeneration: () => void;
  onListen: () => void;
}

const Step5_EditPrompt: React.FC<Step5EditPromptProps> = ({
  editedPrompt,
  setEditedPrompt,
  isLoading,
  isListening,
  onStartGeneration,
  onListen,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
      <LoadingOverlay isLoading={isLoading} message="Generating new prompt..." />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-3xl"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Refine Your Vision
        </h2>
        <p className="text-gray-300 mb-6 font-medium">
          Adjust the prompt to perfection, or use your voice to add ideas.
        </p>

        <textarea
          className="w-full h-48 p-4 rounded-2xl bg-gray-900/70 border border-gray-600/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-lg text-gray-200 resize-none custom-scrollbar placeholder-gray-500 transition-all duration-300"
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          placeholder="e.g., 'A majestic lion made of fire, with a flowing mane of embers...'"
          disabled={isLoading}
        />

        <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onListen}
            className={`w-full sm:w-auto btn-secondary group flex items-center justify-center transition-all duration-300 ${
              isListening ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900" : ""
            }`}
            disabled={isLoading}
          >
            <div className={`${isListening ? "animate-pulse text-cyan-400" : ""}`}>
              <MicrophoneIcon />
            </div>
            <span className="ml-2">{isListening ? "Listening..." : "Use Voice"}</span>
          </button>
          <button
            type="button"
            onClick={onStartGeneration}
            className="w-full sm:w-auto btn-primary"
            disabled={isLoading || !editedPrompt.trim()}
          >
            ✨
            <span className="ml-2">Generate Masterpiece</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5_EditPrompt;
