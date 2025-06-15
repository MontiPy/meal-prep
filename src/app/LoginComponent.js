"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginComponent() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 anime-card">
      <h1 className="text-3xl font-bold mb-4 font-heading">Sign In</h1>
      <button onClick={handleLogin} className="anime-btn text-xl">
        Sign in with Google
      </button>
    </div>
  );
}
