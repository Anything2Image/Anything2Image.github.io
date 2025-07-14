import React from "react";
import LoadingOverlay from "../ui/LoadingOverlay";
import MagicWandIcon from "../icons/MagicWandIcon";
import SparkleIcon from "../icons/SparkleIcon";

interface Suggestions {
  animals: string[];
  prompts: string[];
  negative_prompts: string[];
}

export interface Step4ChooseAnimalProps {
  isLoading: boolean;
  previewUrl: string | null;
  maskPreviewUrl: string | null;
  suggestions: Suggestions;
  selectedAnimal: string;
  setSelectedAnimal: (animal: string) => void;
  customAnimal: string;
  setCustomAnimal: (animal: string) => void;
  setCurrentStep: (step: number) => void;
}

const Step4_ChooseAnimal: React.FC<Step4ChooseAnimalProps> = ({
  isLoading,
  previewUrl,
  maskPreviewUrl,
  suggestions,
  selectedAnimal,
  setSelectedAnimal,
  customAnimal,
  setCustomAnimal,
  setCurrentStep,
}) => (
  <div className="grid lg:grid-cols-2 gap-8 items-start relative">
    <LoadingOverlay isLoading={isLoading} message="Crafting your animal transformation..." />
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          Ready to Transform
        </h2>
        <div className="relative w-full h-64 bg-gray-800/50 rounded-2xl overflow-hidden shadow-inner">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Original"
              className="w-full h-full object-contain"
            />
          )}
          {maskPreviewUrl && (
            <img
              src={maskPreviewUrl}
              alt="Mask"
              className="absolute top-0 left-0 w-full h-full object-contain opacity-60 mix-blend-screen pointer-events-none animate-pulse"
            />
          )}
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          Choose Your Animal
        </h2>
        <p className="text-gray-300 mb-6 font-medium">
          Pick from AI suggestions or create your own!
        </p>
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {suggestions.animals.map((animal) => (
            <button
              key={animal}
              onClick={() => {
                setSelectedAnimal(animal);
                setCustomAnimal("");
              }}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 text-white font-medium focus:outline-none transform hover:scale-105 ${
                selectedAnimal === animal
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-xl shadow-pink-500/25 ring-2 ring-pink-400/50"
                  : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-pink-400/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{animal}</span>
                {selectedAnimal === animal && <SparkleIcon />}
              </div>
            </button>
          ))}
          <button
            onClick={() => setSelectedAnimal("Other")}
            className={`group w-full text-left p-4 rounded-xl transition-all duration-300 text-white font-medium focus:outline-none transform hover:scale-105 ${
              selectedAnimal === "Other"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-xl shadow-pink-500/25 ring-2 ring-pink-400/50"
                : "bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-pink-400/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Other...</span>
              {selectedAnimal === "Other" && <SparkleIcon />}
            </div>
          </button>
        </div>
        {selectedAnimal === "Other" && (
          <input
            type="text"
            value={customAnimal}
            onChange={(e) => setCustomAnimal(e.target.value)}
            placeholder="Enter animal name (e.g., 'a fox')"
            className="mt-4 w-full input-primary"
          />
        )}
        <button
          onClick={() => setCurrentStep(5)}
          disabled={isLoading}
          className="mt-6 w-full btn-primary"
        >
          <MagicWandIcon />
          <span className="ml-2">Generate Final Image</span>
        </button>
      </div>
    </div>
  </div>
);

export default Step4_ChooseAnimal; 