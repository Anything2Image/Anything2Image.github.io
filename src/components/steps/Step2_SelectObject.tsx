import React from "react";
import LoadingOverlay from "../ui/LoadingOverlay";
import MagicWandIcon from "../icons/MagicWandIcon";
import SparkleIcon from "../icons/SparkleIcon";

export interface Step2SelectObjectProps {
  isLoading: boolean;
  previewUrl: string | null;
  objectLabel: string;
  setObjectLabel: (label: string) => void;
  customLabel: string;
  setCustomLabel: (label: string) => void;
  handleGenerateMask: () => void;
}

const Step2_SelectObject: React.FC<Step2SelectObjectProps> = ({
  isLoading,
  previewUrl,
  objectLabel,
  setObjectLabel,
  customLabel,
  setCustomLabel,
  handleGenerateMask,
}) => (
  <div className="grid lg:grid-cols-2 gap-8 items-start relative">
    <LoadingOverlay isLoading={isLoading} message="Analyzing image and generating mask..." />
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Your Image
        </h2>
        {previewUrl && (
          <div className="w-full h-96 bg-gray-800/50 rounded-2xl overflow-hidden shadow-inner">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Select Object Type
        </h2>
        <p className="text-gray-300 mb-6 font-medium">
          What do you want to transform into something amazing?
        </p>
        <div className="space-y-3">
          {["Stone", "Cloud", "Fire", "Leaf", "Other"].map((opt) => (
            <button
              key={opt}
              onClick={() => setObjectLabel(opt)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 text-white font-medium focus:outline-none transform hover:scale-105 ${
                objectLabel === opt
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-xl shadow-green-500/25 ring-2 ring-green-400/50"
                  : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-green-400/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {objectLabel === opt && <SparkleIcon />}
              </div>
            </button>
          ))}
        </div>
        {objectLabel === "Other" && (
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Enter custom label (e.g., 'a mountain')"
            className="mt-4 w-full input-primary"
          />
        )}
        <button
          onClick={handleGenerateMask}
          disabled={isLoading}
          className="mt-6 w-full btn-primary group"
        >
          <MagicWandIcon />
          <span className="ml-2">Generate Mask</span>
        </button>
      </div>
    </div>
  </div>
);

export default Step2_SelectObject; 