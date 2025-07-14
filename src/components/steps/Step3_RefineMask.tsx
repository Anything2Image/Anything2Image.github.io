import React from "react";
import LoadingOverlay from "../ui/LoadingOverlay";

export interface Step3RefineMaskProps {
  isLoading: boolean;
  previewUrl: string | null;
  maskPreviewUrl: string | null;
  refinedLabel: string;
  setRefinedLabel: (label: string) => void;
  handleRefineMask: () => void;
  handleConfirmMask: () => void;
}

const Step3_RefineMask: React.FC<Step3RefineMaskProps> = ({
  isLoading,
  previewUrl,
  maskPreviewUrl,
  refinedLabel,
  setRefinedLabel,
  handleRefineMask,
  handleConfirmMask,
}) => (
  <div className="grid lg:grid-cols-2 gap-8 items-start relative">
    <LoadingOverlay isLoading={isLoading} message="Refining mask based on your feedback..." />
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Mask Preview
        </h2>
        <p className="text-gray-300 mb-4 font-medium">
          Compare the original with the masked area that will be transformed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-center text-sm mb-2 text-gray-400 font-medium">
              Original
            </p>
            <div className="w-full h-56 bg-gray-800/50 rounded-2xl overflow-hidden shadow-inner">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-center text-sm mb-2 text-gray-400 font-medium">
              Masked Preview
            </p>
            <div className="relative w-full h-56 bg-gray-800/50 rounded-2xl overflow-hidden shadow-inner">
              {maskPreviewUrl && (
                <img
                  src={maskPreviewUrl}
                  alt="Mask"
                  className="absolute top-0 left-0 w-full h-full object-contain opacity-60 mix-blend-screen pointer-events-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Refine Detection
        </h3>
        <p className="text-gray-300 mb-4 font-medium">
          Not quite right? Describe the object more specifically.
        </p>
        <input
          type="text"
          value={refinedLabel}
          onChange={(e) => setRefinedLabel(e.target.value)}
          placeholder="e.g., 'the large rock in the center'"
          className="w-full input-primary"
        />
        <button
          onClick={handleRefineMask}
          disabled={isLoading}
          className="mt-4 w-full btn-secondary group"
        >
          <span>🎯 Refine Mask</span>
        </button>
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        <button
          onClick={handleConfirmMask}
          disabled={isLoading}
          className="w-full btn-primary group"
        >
          <span>✨ Looks Good - Continue</span>
        </button>
      </div>
    </div>
  </div>
);

export default Step3_RefineMask; 