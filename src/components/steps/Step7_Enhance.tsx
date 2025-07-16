import React, { useState } from "react";
import RestartIcon from "../icons/RestartIcon"; // Giả sử bạn có icon này

export interface Step7EnhanceProps {
  finalImageUrl: string | null;
  originalPrompt: string;
  animalName: string;
  onRestart: () => void;
  apiService: {
    generateStory: (
      apiUrl: string,
      prompt: string,
      animalName: string
    ) => Promise<string>;
    convertToSketch: (
      apiUrl: string,
      imageBase64: string,
    ) => Promise<string>;
    upscaleImage: (
      apiUrl: string,
      imageBase64: string,
      targetResolution: string
    ) => Promise<string>;
    removeBackground: (apiUrl: string, imageBase64: string) => Promise<string>;
  };
  apiUrl: string;
}

// --- Type Definitions ---
type PreviewType =
  | "original"
  | "sketch"
  | "no_bg"
  | "upscaled_2k"
  | "upscaled_4k";
type LoadingStates = {
  story: boolean;
  sketch: boolean;
  noBg: boolean;
  upscale2k: boolean;
  upscale4k: boolean;
};
type ErrorStates = {
  story: string | null;
  effects: string | null;
  upscale: string | null;
};

// --- Helper Components ---
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const Step7_Enhance: React.FC<Step7EnhanceProps> = ({
  finalImageUrl,
  originalPrompt,
  animalName,
  onRestart,
  apiService,
  apiUrl,
}) => {
  // --- State Management ---
  const [activePreview, setActivePreview] = useState<PreviewType>("original");
  const [sketchResult, setSketchResult] = useState<string | null>(null);
  const [noBgResult, setNoBgResult] = useState<string | null>(null);
  const [upscaled2kResult, setUpscaled2kResult] = useState<string | null>(null);
  const [upscaled4kResult, setUpscaled4kResult] = useState<string | null>(null);
  const [story, setStory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<LoadingStates>({
    story: false,
    sketch: false,
    noBg: false,
    upscale2k: false,
    upscale4k: false,
  });
  const [errors, setErrors] = useState<ErrorStates>({
    story: null,
    effects: null,
    upscale: null,
  });

  // --- Preview Logic ---
  const previewSources: Record<PreviewType, string | null> = {
    original: finalImageUrl,
    sketch: sketchResult,
    no_bg: noBgResult,
    upscaled_2k: upscaled2kResult,
    upscaled_4k: upscaled4kResult,
  };
  const currentPreviewImage = previewSources[activePreview];
  const isTransparent = activePreview === "no_bg" && noBgResult;
  const checkerboardBg = isTransparent
    ? "bg-[linear-gradient(45deg,_#ccc_25%,_transparent_25%),_linear-gradient(-45deg,_#ccc_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_#ccc_75%),_linear-gradient(-45deg,_transparent_75%,_#ccc_75%)] bg-[length:20px_20px] bg-white"
    : "bg-gray-800";

  // --- Handlers ---
  const getBase64FromSource = (source: string) =>
    source.replace(/^data:image\/\w+;base64,/, "");

  const handleDownload = () => {
    if (!currentPreviewImage) return;
    const link = document.createElement("a");
    link.href = currentPreviewImage;
    link.download = `anything2image_${animalName}_${activePreview}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateStory = async () => {
    if (story) return;
    setIsLoading((prev) => ({ ...prev, story: true }));
    setErrors((prev) => ({ ...prev, story: null }));
    try {
      const result = await apiService.generateStory(
        apiUrl,
        originalPrompt,
        animalName
      );
      setStory(result);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        story: err.message || "Failed to generate story.",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, story: false }));
    }
  };

  const handleCopyStory = () => {
    if (story) navigator.clipboard.writeText(story);
  };

  const handleConvertToSketch = async () => {
    if (sketchResult) {
      setActivePreview("sketch");
      return;
    }
    if (!finalImageUrl) {
      setErrors((prev) => ({
        ...prev,
        effects: "Cannot generate sketch: Missing final image or mask URL.",
      }));
      return;
    }

    setIsLoading((prev) => ({ ...prev, sketch: true }));
    setErrors((prev) => ({ ...prev, effects: null }));
    try {
      const result = await apiService.convertToSketch(
        apiUrl,
        getBase64FromSource(finalImageUrl),
      );
      const newImage = `data:image/png;base64,${result}`;
      setSketchResult(newImage);
      setActivePreview("sketch");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        effects: err.message || "Failed to convert to sketch.",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, sketch: false }));
    }
  };

  const handleRemoveBackground = async () => {
    if (noBgResult) {
      setActivePreview("no_bg");
      return;
    }
    if (!finalImageUrl) {
      setErrors((prev) => ({
        ...prev,
        effects: "Cannot remove background: Missing final image URL.",
      }));
      return;
    }
    setIsLoading((prev) => ({ ...prev, noBg: true }));
    setErrors((prev) => ({ ...prev, effects: null }));
    try {
      const result = await apiService.removeBackground(
        apiUrl,
        getBase64FromSource(finalImageUrl)
      );
      const newImage = `data:image/png;base64,${result}`;
      setNoBgResult(newImage);
      setActivePreview("no_bg");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        effects: err.message || "Failed to remove background.",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, noBg: false }));
    }
  };


  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-8">
      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Left Column: Preview Area --- */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-full aspect-square rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl flex items-center justify-center transition-all duration-300 ${checkerboardBg}`}
          >
            {currentPreviewImage ? (
              <img
                src={currentPreviewImage}
                alt={`${animalName} - ${activePreview}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 p-8 text-center">
                Select an enhancement to preview it here.
              </div>
            )}
          </div>

          {/* View Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <button
              onClick={() => setActivePreview("original")}
              className={`btn-tertiary ${
                activePreview === "original" ? "ring-2 ring-purple-400" : ""
              }`}
            >
              View Original
            </button>
            {sketchResult && (
              <button
                onClick={() => setActivePreview("sketch")}
                className={`btn-tertiary ${
                  activePreview === "sketch" ? "ring-2 ring-purple-400" : ""
                }`}
              >
                View Sketch
              </button>
            )}
            {noBgResult && (
              <button
                onClick={() => setActivePreview("no_bg")}
                className={`btn-tertiary ${
                  activePreview === "no_bg" ? "ring-2 ring-purple-400" : ""
                }`}
              >
                View No BG
              </button>
            )}
            {upscaled2kResult && (
              <button
                onClick={() => setActivePreview("upscaled_2k")}
                className={`btn-tertiary ${
                  activePreview === "upscaled_2k"
                    ? "ring-2 ring-purple-400"
                    : ""
                }`}
              >
                View 2K
              </button>
            )}
            {upscaled4kResult && (
              <button
                onClick={() => setActivePreview("upscaled_4k")}
                className={`btn-tertiary ${
                  activePreview === "upscaled_4k"
                    ? "ring-2 ring-purple-400"
                    : ""
                }`}
              >
                View 4K
              </button>
            )}
          </div>
        </div>

        {/* --- Right Column: Controls --- */}
        <div className="flex flex-col gap-10">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-xl text-white mb-4">
              Creative Tools
            </h3>
            <div className="flex flex-col gap-5">
              <button
                onClick={handleGenerateStory}
                disabled={isLoading.story}
                className="btn-primary justify-between"
              >
                <span>{story ? "Story Generated!" : "Generate Story"}</span>
                {isLoading.story && <LoadingSpinner />}
              </button>
              {errors.story && (
                <div className="text-red-400 text-sm">{errors.story}</div>
              )}
              {story && (
                <>
                  <textarea
                    className="w-full h-36 p-3 rounded-lg bg-gray-900 text-gray-200 resize-none custom-scrollbar"
                    value={story}
                    readOnly
                  />
                  <button onClick={handleCopyStory} className="btn-tertiary">
                    Copy Story
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-xl text-white mb-4">Image Effects</h3>
            <div className="flex flex-col gap-6">
              <button
                onClick={handleConvertToSketch}
                disabled={
                  !finalImageUrl ||
                  isLoading.sketch ||
                  isLoading.noBg
                }
                className="btn-secondary justify-between"
                title={
                  !finalImageUrl
                    ? "Requires a generated image and a mask"
                    : ""
                }
              >
                <span>{sketchResult ? "View Sketch" : "To Sketch"}</span>
                {isLoading.sketch && <LoadingSpinner />}
              </button>
              <button
                onClick={handleRemoveBackground}
                disabled={!finalImageUrl || isLoading.sketch || isLoading.noBg}
                className="btn-secondary justify-between"
                title={!finalImageUrl ? "Requires a generated image" : ""}
              >
                <span>{noBgResult ? "View No BG" : "Remove BG"}</span>
                {isLoading.noBg && <LoadingSpinner />}
              </button>
            </div>
            {errors.effects && (
              <div className="text-red-400 text-sm mt-2">{errors.effects}</div>
            )}
          </div>
        </div>
      </div>

      {/* --- Final Action Bar --- */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button
          className="btn-success w-full"
          onClick={handleDownload}
          disabled={!currentPreviewImage}
        >
          Download {activePreview.replace("_", " ")}
        </button>
        <button className="w-full btn-secondary" onClick={onRestart}>
          <RestartIcon /> <span className="ml-2">Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default Step7_Enhance;
