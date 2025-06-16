"use client";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardContent() {
  const { user } = useAuth();

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ background: "var(--anime-bg)" }}
    >
      <div className="w-full max-w-lg anime-card text-center space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: "#d45437" }}>
          Welcome to Meal Prep!
        </h1>
        <p>
          Use the menu on the left to explore the app. Build recipes and meal
          plans by dragging ingredients and recipes into your daily meals. You
          can drag items between meals or back to the sidebar to remove them.
        </p>
        <Image
          src="/cooking.svg"
          alt="Cooking"
          width={200}
          height={160}
          className="mx-auto"
        />
        <button
          onClick={() => signOut(auth)}
          className="anime-btn mt-4"
          style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
