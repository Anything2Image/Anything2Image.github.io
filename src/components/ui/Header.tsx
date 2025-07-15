import { useState } from "react";
import SignInModal from "./SignIn";
import SignUpModal from "./SignUp";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  // 👉 Handlers
  const openSignIn = () => setShowSignIn(true);
  const openSignUp = () => setShowSignUp(true);
  const closeSignIn = () => setShowSignIn(false);
  const closeSignUp = () => setShowSignUp(false);

  const handleSignInSubmit = (email: string, password: string) => {
    console.log("Logging in with", email, password);
    if (isLoggedIn) {
      console.log("Already logged in, logging out");
      logout();
    } else {
      console.log("Logging in");
      login();
    }
    closeSignIn();
  };

  const handleSignUpSubmit = (email: string, password: string) => {
    console.log("Signing up with", email, password);
    // TODO: call backend
    closeSignUp();
  };

  return (
    <header className="w-full bg-transparent border-b border-gray-700 mb-6">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
          Anything<span className="text-blue-400">2</span>Image
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex justify-center gap-8 text-base font-semibold text-gray-200">
          <a href="#how-it-works" className="hover:text-white">How it works</a>
          <a href="#introduction" className="hover:text-white">Introduction</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>

        {/* Auth Links */}
        <div className="flex gap-4 text-base font-semibold">
          {isLoggedIn ? (
            <>
              <a href="#home" className="text-white hover:text-blue-400">Home</a>
              <span
                className="text-red-400 hover:text-white cursor-pointer"
                onClick={logout}
              >
                Log Out
              </span>
            </>
          ) : (
            <>
              <span
                className="text-blue-400 hover:text-white cursor-pointer"
                onClick={openSignIn}
              >
                Sign In
              </span>
              <span
                className="text-green-400 hover:text-white cursor-pointer"
                onClick={openSignUp}
              >
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <SignInModal
        isOpen={showSignIn}
        onClose={closeSignIn}
        onSubmit={handleSignInSubmit}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={closeSignUp}
        onSubmit={handleSignUpSubmit}
      />
    </header>
  );
}
