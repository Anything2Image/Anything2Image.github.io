import React from "react";
import Spinner from "../icons/Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = "Processing magic..." }) => {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-3xl">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-gray-900 p-8 rounded-2xl border border-gray-700 flex flex-col items-center justify-center">
          <Spinner />
          <p className="mt-4 text-lg font-semibold text-white">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 