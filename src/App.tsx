import React, { useState, useRef, useEffect } from "react";
import "./styles/global.css";

// --- UI Components ---
import Logo from "./components/ui/Logo";
import StepIndicator from "./components/ui/StepIndicator";
import FloatingParticles from "./components/ui/FloatingParticles";
import Headers from "./components/ui/Header";
import Introduction from "./components/ui/Introduction";
import HowItWorks from "./components/ui/HowItWork";
import Footer from "./components/ui/Footer";
import AddToGallModal from "./components/ui/AddToGall";

// --- Step Components ---
import Step1_Upload from "./components/steps/Step1_Upload";
import Step2_SelectObject from "./components/steps/Step2_SelectObject";
import Step3_RefineMask from "./components/steps/Step3_RefineMask";
import Step4_ChooseAnimal from "./components/steps/Step4_ChooseAnimal";
import Step5_EditPrompt from "./components/steps/Step5_EditPrompt";
import Step6_Result from "./components/steps/Step6_Result";
import Step7_Enhance from "./components/steps/Step7_Enhance";

// --- Services & Types ---
import {
  generateMask,
  refineMask,
  getSuggestions,
  generateCustomPrompt,
  generateFinalImageStep6,
  saveToGalleryAPI,
  generateStory,
  convertToSketch,
  upscaleImage,
  removeBackground,
} from "./services/api";
import type { Suggestions } from "./types";
import { useAuth } from "./components/auth/AuthContext";

// --- Notifications ---
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// --- Helper function to convert blob URL to Base64 Data URL ---
async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


export default function App() {
  // --- State Management ---
  const { uid } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [imageToSave, setImageToSave] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maskPreviewUrl, setMaskPreviewUrl] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);

  const [objectLabel, setObjectLabel] = useState<string>("Stone");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [refinedLabel, setRefinedLabel] = useState<string>("");

  const [suggestions, setSuggestions] = useState<Suggestions>({
    animals: [],
    prompts: [],
    negative_prompts: [],
  });
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  const [customAnimal, setCustomAnimal] = useState<string>("");

  const [editedPrompt, setEditedPrompt] = useState<string>("");
  const [editedNegativePrompt, setEditedNegativePrompt] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiUrl, setApiUrl] = useState("");

  // --- Web Speech API ---
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      setEditedPrompt((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // --- Handlers & Logic ---
  const handleRestart = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setPreviewUrl(null);
    setMaskPreviewUrl(null);
    setFinalImageUrl(null);
    setObjectLabel("Stone");
    setCustomLabel("");
    setRefinedLabel("");
    setSuggestions({ animals: [], prompts: [], negative_prompts: [] });
    setSelectedAnimal("");
    setCustomAnimal("");
    setEditedPrompt("");
    setEditedNegativePrompt("");
    setIsListening(false);
    setIsLoading(false);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Reset state for a new run
      setMaskPreviewUrl(null);
      setFinalImageUrl(null);
      setObjectLabel("Stone");
      setCustomLabel("");
      setRefinedLabel("");
      setSuggestions({ animals: [], prompts: [], negative_prompts: [] });
      setSelectedAnimal("");
      setCustomAnimal("");
      setEditedPrompt("");
      setEditedNegativePrompt("");
      setError("");
      // Set new file and move to next step
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentStep(2);
    }
  };

  const handleGenerateMask = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }
    const labelToUse = objectLabel === "Other" ? customLabel : objectLabel;
    if (!labelToUse) {
      setError("Please select or enter an object label.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await generateMask(apiUrl, selectedFile, labelToUse);
      setMaskPreviewUrl(`data:image/png;base64,${data.mask_image_base64}`);
      setRefinedLabel(labelToUse);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineMask = async () => {
    if (!refinedLabel) {
      setError("Please enter a label to refine the mask.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await refineMask(apiUrl, refinedLabel);
      setMaskPreviewUrl(`data:image/png;base64,${data.mask_image_base64}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMask = async () => {
    setIsLoading(true);
    setError("");
    try {
      setCurrentStep(4);
      const data = await getSuggestions(apiUrl);
      setSuggestions(data);
      if (data.animals && data.animals.length > 0) {
        setSelectedAnimal(data.animals[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnimal = (index: number) => {
    const animal = suggestions.animals[index];
    const prompt = suggestions.prompts[index] || `A high-quality, photorealistic image of a ${animal}.`;
    const negative_prompt = suggestions.negative_prompts[index] || "blurry, low quality, text, watermark";
    setSelectedAnimal(animal);
    setEditedPrompt(prompt);
    setEditedNegativePrompt(negative_prompt);
    setCurrentStep(5);
  };

  const handleCustomAnimal = async (animalName: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await generateCustomPrompt(apiUrl, animalName);
      setSelectedAnimal(animalName);
      setEditedPrompt(data.prompt);
      setEditedNegativePrompt(data.negative_prompt);
      setCurrentStep(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFinalGeneration = async () => {
    if (!editedPrompt) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      setCurrentStep(6);
      const data = await generateFinalImageStep6(apiUrl, editedPrompt, editedNegativePrompt);
      setFinalImageUrl(`data:image/png;base64,${data.final_image_base64}`);
    } catch (err: any) {
      setError(err.message);
      setCurrentStep(5); // Go back to prompt editing on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = (imageUrl: string | null) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "anything2image-art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Gallery & Step 7 Handlers ---

  const handleGoToEnhance = () => {
    setCurrentStep(7);
  };

  const handleAddToGallery = (imageUrl: string | null) => {
    if (!uid) {
        toast.error("You must be logged in to save to the gallery.");
        return;
    }
    if (!imageUrl) {
        toast.error("No image available to save.");
        return;
    }
    setImageToSave(imageUrl); // Set the image to be saved
    setIsOpenModal(true); // Open the modal
  };

  const SaveContent = async (artName: string, description: string) => {
    if (!uid) {
      toast.error("User is not authenticated.");
      return;
    }
    if (!previewUrl || !imageToSave) {
      toast.error("Missing image data for saving.");
      return;
    }

    setIsLoading(true);
    try {
      const originalImageDataUrl = await blobUrlToDataUrl(previewUrl);
      await saveToGalleryAPI(
        uid,
        artName,
        description,
        editedPrompt,
        selectedAnimal,
        originalImageDataUrl,
        maskPreviewUrl || "",
        imageToSave // Use the image URL that was set when the modal opened
      );
      toast.success("Art saved to your gallery successfully!");
    } catch (error: any) {
      console.error("Failed to save to gallery:", error);
      toast.error(error.message || "Failed to save to gallery.");
    } finally {
      setIsLoading(false);
      setIsOpenModal(false);
      setImageToSave(null);
    }
  };

  const apiEnhanceService = {
    generateStory,
    convertToSketch,
    upscaleImage,
    removeBackground,
  };

  // --- Render Methods for Each Step ---
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Upload
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
        );
      case 2:
        return (
          <Step2_SelectObject
            isLoading={isLoading}
            previewUrl={previewUrl}
            objectLabel={objectLabel}
            setObjectLabel={setObjectLabel}
            customLabel={customLabel}
            setCustomLabel={setCustomLabel}
            handleGenerateMask={handleGenerateMask}
          />
        );
      case 3:
        return (
          <Step3_RefineMask
            isLoading={isLoading}
            previewUrl={previewUrl}
            maskPreviewUrl={maskPreviewUrl}
            refinedLabel={refinedLabel}
            setRefinedLabel={setRefinedLabel}
            handleRefineMask={handleRefineMask}
            handleConfirmMask={handleConfirmMask}
          />
        );
      case 4:
        return (
          <Step4_ChooseAnimal
            isLoading={isLoading}
            previewUrl={previewUrl}
            maskPreviewUrl={maskPreviewUrl}
            suggestions={suggestions}
            selectedAnimal={selectedAnimal}
            setSelectedAnimal={setSelectedAnimal}
            customAnimal={customAnimal}
            setCustomAnimal={setCustomAnimal}
            handleSelectAnimal={handleSelectAnimal}
            handleCustomAnimal={handleCustomAnimal}
          />
        );
      case 5:
        return (
          <Step5_EditPrompt
            editedPrompt={editedPrompt}
            setEditedPrompt={setEditedPrompt}
            isLoading={isLoading}
            isListening={isListening}
            onStartGeneration={handleStartFinalGeneration}
            onListen={handleToggleListening}
          />
        );
      case 6:
        return (
          <Step6_Result
            isLoading={isLoading}
            finalImageUrl={finalImageUrl}
            error={error}
            handleDownloadClick={() => handleDownloadClick(finalImageUrl)}
            handleRestart={handleRestart}
            onEnhance={handleGoToEnhance}
            handleAddToGallery={() => handleAddToGallery(finalImageUrl)}
          />
        );
      case 7:
        return (
          <Step7_Enhance
            finalImageUrl={finalImageUrl}
            originalPrompt={editedPrompt}
            animalName={selectedAnimal}
            onRestart={handleRestart}
            apiService={apiEnhanceService}
            apiUrl={apiUrl}
            handleDownloadClick={handleDownloadClick}
            handleAddToGallery={handleAddToGallery}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <FloatingParticles />
      <Headers />
      <Introduction />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-5xl mx-auto">
          <header className="mb-10">
            <Logo currentStep={currentStep} />
          </header>
          <main>
            <StepIndicator currentStep={currentStep} />
            <div className="max-w-2xl mx-auto mb-auto w-full">
              <label
                htmlFor="api-url"
                className="block text-sm font-medium text-gray-400 mb-2 text-center"
              >
                Backend API URL (Ngrok)
              </label>
              <input
                id="api-url"
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Dán địa chỉ ngrok của bạn vào đây"
                className="w-full input-primary text-center"
              />
              {!apiUrl && (
                <p className="text-center text-yellow-500 text-xs mt-2 animate-pulse">
                  ↑ Please provide URL Backend before starting.
                </p>
              )}
            </div>
            {error && (
              <div
                className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl relative mb-6 text-center"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="transition-all duration-500">
              {renderCurrentStep()}
            </div>
          </main>
        </div>
      </div>
      <HowItWorks />
      <Footer />
      <AddToGallModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={(artName: string, description: string) => {
          SaveContent(artName, description);
        }}
        isLoading={isLoading}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
