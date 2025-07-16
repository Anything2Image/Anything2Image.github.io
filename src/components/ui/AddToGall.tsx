
import React from "react";

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (artName: string, description: string) => void;
    isLoading: boolean;
}

export default function AddToGallModal({ isOpen, onClose, onSubmit }: SignInModalProps) {
    const [artName, setArtName] = React.useState("");
    const [description, setDiscription] = React.useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-lg relative">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-white text-xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                    Describe Your Art
                </h2>

                {/* Email Input */}
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
                    Art Name
                </label>
                <input
                    type="text"
                    value={artName}
                    onChange={(e) => setArtName(e.target.value)}
                    placeholder="My cute dog"
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    required
                />

                {/* Password Input */}
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDiscription(e.target.value)}
                    placeholder="A cute dog with a big smile"
                    rows={7}
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    required
                />

                {/* Submit Button */}
                <button
                    onClick={() => onSubmit(artName, description)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
