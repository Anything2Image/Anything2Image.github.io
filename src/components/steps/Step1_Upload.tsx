import React from "react";
import UploadIcon from "../icons/UploadIcon";

export interface Step1UploadProps {
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step1_Upload: React.FC<Step1UploadProps> = ({ previewUrl, fileInputRef, handleFileChange }) => (
  <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
    <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Upload Your Image
      </h2>
      <label
        htmlFor="file-upload"
        className="group w-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-blue-400 transition-all duration-300 hover:bg-blue-500/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-2xl p-4"
          />
        ) : (
          <div className="text-center relative z-10">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <UploadIcon />
            </div>
            <p className="mb-2 text-sm text-gray-300 font-medium">
              <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or other image formats
            </p>
          </div>
        )}
      </label>
      <p className="text-center text-gray-400 text-sm mt-6 font-medium">
        Upload any image and watch the magic happen! ✨
      </p>
    </div>
  </div>
);

export default Step1_Upload; 