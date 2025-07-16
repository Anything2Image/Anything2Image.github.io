import React from "react";
import LoadingOverlay from "../ui/LoadingOverlay";
import DownloadIcon from "../icons/DownloadIcon";
import RestartIcon from "../icons/RestartIcon";
import MagicWandIcon from "../icons/MagicWandIcon";
import SaveToGalleryIcon from "../icons/SaveIcon";
import { useAuth } from "../auth/AuthContext";

export interface Step6ResultProps {
  isLoading: boolean;
  finalImageUrl: string | null;
  error: string;
  handleDownloadClick: () => void;
  handleRestart: () => void;
  onEnhance: () => void;
  handleAddToGallery: () => void;
}

const Step6_Result: React.FC<Step6ResultProps> = ({
  isLoading,
  finalImageUrl,
  error,
  handleDownloadClick,
  handleRestart,
  onEnhance,
  handleAddToGallery
}) => {
  const { uid } = useAuth();
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl"></div>
      <LoadingOverlay
        isLoading={isLoading && !finalImageUrl}
        message="Putting the final touches on your masterpiece..."
      />
      <div className="relative z-10 w-full">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Your Masterpiece!
        </h2>
        <div className="w-full aspect-square max-h-[60vh] bg-gray-900/50 rounded-2xl shadow-inner flex items-center justify-center">
          {finalImageUrl ? (
            <img
              src={finalImageUrl}
              alt="Final generated"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : !isLoading && error ? (
            <div className="text-red-400 p-4">
              <p>Oops! Something went wrong.</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="text-gray-400 h-96 flex items-center justify-center">
              {/* This message shows before loading starts */}
            </div>
          )}
        </div>
        <div className="mt-6 w-full flex items-center justify-center">
        <button
          onClick={onEnhance}
          disabled={!finalImageUrl || isLoading}
          className="btn-primary w-full max-w-xs"
        >
          <MagicWandIcon /> <span className="ml-2"> Enhance Your Image</span>
        </button>
      </div>
      <div className="mt-4 w-full flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleDownloadClick}
            disabled={!finalImageUrl || isLoading}
            className="w-full sm:w-1/2 btn-success"
          >
            <DownloadIcon /> <span className="ml-2">Download</span>
          </button>
          <button
            onClick={handleRestart}
            className="w-full sm:w-1/2 btn-secondary"
          >
            <RestartIcon /> <span className="ml-2">Start Over</span>
          </button>
          {uid && (
            <button className="w-full sm:w-1/2 btn-primary" onClick={handleAddToGallery}>
              <SaveToGalleryIcon />
              <span className="ml-2">Save to Gallery</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step6_Result;
