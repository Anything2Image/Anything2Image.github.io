import React, { useState } from "react";
import RestartIcon from "../icons/RestartIcon";
import LoadingSpinner from "../icons/LoadingSpinner";
export interface Step7EnhanceProps {
  finalImageUrl: string;
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
      imageBase64: string
    ) => Promise<string>;
    removeBackground: (apiUrl: string, imageBase64: string) => Promise<string>;
  };
  apiUrl: string;
}

type PreviewType = "original" | "sketch" | "no_bg";

type LoadingStates = {
  story: boolean;
  sketch: boolean;
  noBg: boolean;
};

type ErrorStates = {
  story: string | null;
  effects: string | null;
};

// --- Main Component ---

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
  const [story, setStory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<LoadingStates>({
    story: false,
    sketch: false,
    noBg: false,
  });
  const [errors, setErrors] = useState<ErrorStates>({
    story: null,
    effects: null,
  });

  // --- Derived State & Variables ---
  const previewSources: Record<PreviewType, string | null> = {
    original: finalImageUrl,
    sketch: sketchResult,
    no_bg: noBgResult,
  };
  const currentPreviewImage = previewSources[activePreview];
  const isTransparent = activePreview === "no_bg" && noBgResult;
  // Creates a checkerboard pattern for transparent background previews
  const checkerboardBg = isTransparent
    ? "bg-[linear-gradient(45deg,_#ccc_25%,_transparent_25%),_linear-gradient(-45deg,_#ccc_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_#ccc_75%),_linear-gradient(-45deg,_transparent_75%,_#ccc_75%)] bg-[length:20px_20px] bg-white"
    : "bg-gray-800";

  // --- Handlers ---

  /**
   * Extracts the base64 content from a data URL.
   */
  const getBase64FromSource = (source: string) =>
    source.replace(/^data:image\/\w+;base64,/, "");

  /**
   * Triggers a browser download for the currently active image.
   */
  const handleDownload = () => {
    if (!currentPreviewImage) return;
    const link = document.createElement("a");
    link.href = currentPreviewImage;
    link.download = `anything2image_${animalName}_${activePreview}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Calls the API to generate a story based on the original prompt.
   */
  const handleGenerateStory = async () => {
    if (story) return; // Don't re-generate if story already exists
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

  /**
   * Copies the generated story to the clipboard.
   */
  const handleCopyStory = () => {
    if (!story) return;
    // Use modern clipboard API with a fallback for older browsers/iframes
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(story).catch(err => {
            console.error("Async clipboard copy failed:", err);
            // Fallback to execCommand
            fallbackCopyTextToClipboard(story);
        });
    } else {
        fallbackCopyTextToClipboard(story);
    }
  };
  
  const fallbackCopyTextToClipboard = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
      } catch (err) {
          console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
  };


  /**
   * Calls the API to convert the original image to a sketch.
   */
  const handleConvertToSketch = async () => {
    // If sketch already exists, just switch the view
    if (sketchResult) {
      setActivePreview("sketch");
      return;
    }
    if (!finalImageUrl) {
      setErrors((prev) => ({
        ...prev,
        effects: "Cannot generate sketch: Original image is missing.",
      }));
      return;
    }

    setIsLoading((prev) => ({ ...prev, sketch: true }));
    setErrors((prev) => ({ ...prev, effects: null }));
    try {
      const result = await apiService.convertToSketch(
        apiUrl,
        getBase64FromSource(finalImageUrl)
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

  /**
   * Calls the API to remove the background from the original image.
   */
  const handleRemoveBackground = async () => {
    // If result already exists, just switch the view
    if (noBgResult) {
      setActivePreview("no_bg");
      return;
    }
    if (!finalImageUrl) {
      setErrors((prev) => ({
        ...prev,
        effects: "Cannot remove background: Original image is missing.",
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
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-8 px-4">
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
          <div className="flex flex-wrap justify-center gap-3 w-full">
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
          </div>
        </div>

        {/* --- Right Column: Controls --- */}
        <div className="flex flex-col gap-6">
          {/* Story Generation */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-xl text-white mb-4">
              Creative Tools
            </h3>
            <div className="flex flex-col gap-3">
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

          {/* Image Effects */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-xl text-white px-1">Image Effects</h3>
             {errors.effects && (
                <div className="text-red-400 text-sm px-1 -mt-2">{errors.effects}</div>
             )}
            {/* To Sketch Box */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between">
                <p className="font-semibold text-white">Convert to Sketch</p>
                <button
                    onClick={handleConvertToSketch}
                    disabled={!finalImageUrl || isLoading.sketch || isLoading.noBg}
                    className="btn-secondary w-36 justify-center"
                    title={!finalImageUrl ? "Requires a generated image" : ""}
                >
                    {isLoading.sketch ? <LoadingSpinner /> : (sketchResult ? "View" : "Generate")}
                </button>
            </div>
             {/* Remove BG Box */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between">
                <p className="font-semibold text-white">Remove Background</p>
                <button
                    onClick={handleRemoveBackground}
                    disabled={!finalImageUrl || isLoading.sketch || isLoading.noBg}
                    className="btn-secondary w-36 justify-center"
                    title={!finalImageUrl ? "Requires a generated image" : ""}
                >
                    {isLoading.noBg ? <LoadingSpinner /> : (noBgResult ? "View" : "Generate")}
                </button>
            </div>
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

// This would typically be in your main App component or a wrapper
const App = () => {
    // Mock data and functions for demonstration purposes
    const mockApiService = {
        generateStory: (prompt: string, animalName: string) => new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve(`This is a wonderful story about a ${animalName} based on the prompt: "${prompt}". It lived happily ever after.`);
            }, 1500);
        }),
        convertToSketch: (imageBase64: string) => new Promise<string>((resolve) => {
            setTimeout(() => {
                // In a real app, this would be the base64 of the sketched image
                resolve(imageBase64); 
            }, 1500);
        }),
        removeBackground: (imageBase64: string) => new Promise<string>((resolve) => {
             setTimeout(() => {
                // In a real app, this would be the base64 of the image with bg removed
                resolve(imageBase64);
            }, 1500);
        }),
    };

    const handleRestart = () => {
        console.log("Restarting the process!");
        // You would reset your application's state here
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            {/* This is a basic set of styles to make the buttons look good for the demo.
                You should integrate this with your project's design system. */}
            <style>{`
                .btn-primary {
                    display: flex; align-items: center; padding: 0.75rem 1.25rem; background-color: #7c3aed; color: white; border-radius: 0.75rem; font-weight: 600; transition: background-color 0.2s;
                }
                .btn-primary:hover { background-color: #6d28d9; }
                .btn-primary:disabled { background-color: #585066; cursor: not-allowed; }

                .btn-secondary {
                    display: flex; align-items: center; padding: 0.75rem 1.25rem; background-color: #374151; color: white; border-radius: 0.75rem; font-weight: 600; border: 1px solid #4b5563; transition: background-color 0.2s;
                }
                .btn-secondary:hover { background-color: #4b5563; }
                .btn-secondary:disabled { background-color: #2b323d; color: #6b7280; cursor: not-allowed; }

                .btn-tertiary {
                    padding: 0.5rem 1rem; background-color: #4b5563; color: #d1d5db; border-radius: 0.5rem; font-weight: 500; transition: background-color 0.2s;
                }
                .btn-tertiary:hover { background-color: #6b7280; }
                
                .btn-success {
                    display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.25rem; background-color: #16a34a; color: white; border-radius: 0.75rem; font-weight: 600; transition: background-color 0.2s;
                }
                .btn-success:hover { background-color: #15803d; }
                .btn-success:disabled { background-color: #585066; cursor: not-allowed; }

                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
            `}</style>
            <Step7_Enhance
                finalImageUrl="https://placehold.co/1024x1024/7c3aed/ffffff?text=Your+Image"
                originalPrompt="A majestic lion in the savanna"
                animalName="Lion"
                onRestart={handleRestart}
                apiService={mockApiService}
                apiUrl="https://api.example.com"
            />
        </div>
    );
}


export default App;
