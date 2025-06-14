"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-700 text-white text-xl rounded-xl shadow-xl"
      >
        Sign in with Google
      </button>
    </div>
  );
}
