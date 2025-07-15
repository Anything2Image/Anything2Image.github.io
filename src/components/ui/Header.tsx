import { useState } from "react";
import SignInModal from "./SignIn";
import SignUpModal from "./SignUp";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";
import { signupAPI } from "../../services/api";

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { uid, login, logout } = useAuth();

  // 👉 Handlers
  const openSignIn = () => setShowSignIn(true);
  const openSignUp = () => setShowSignUp(true);
  const closeSignIn = () => setShowSignIn(false);
  const closeSignUp = () => setShowSignUp(false);

  const handleSignInSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      closeSignIn();
      toast.success("Logged in successfully!");
      closeSignIn();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  const handleSignUpSubmit = async (email: string, password: string, confirmPassword: string, fullName: string) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try{
      await signupAPI(email, password, fullName);
      toast.success("Sign up successful! Please log in.");
      closeSignUp();
    }
    catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
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
          {uid ? (
            <>
              <a href="#home" className="text-white hover:text-blue-400">Home</a>
              <span
                className="text-red-400 hover:text-white cursor-pointer"
                onClick={handleLogout}
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
