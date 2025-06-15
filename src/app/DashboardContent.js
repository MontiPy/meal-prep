"use client";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardContent() {
  const { user } = useAuth();

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ background: "var(--anime-bg)" }}
    >
      <div className="w-full max-w-lg anime-card">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg">
            🍳 Hello,{" "}
            <span className="font-semibold">
              {user?.displayName || user?.email}
            </span>
          </span>
          <button
            onClick={() => signOut(auth)}
            className="anime-btn"
            style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
          >
            Sign Out
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8 font-heading" style={{ color: "#d45437" }}>
          What would you like to do?
        </h1>
        <div className="flex flex-col gap-6">
          <Link href="/calculator" className="anime-btn text-xl text-center">
            🍙 BMR/TDEE Calculator
          </Link>
          <Link
            href="/plan"
            className="anime-btn text-xl text-center"
            style={{ background: "var(--anime-accent)" }}
          >
            🥦 Meal Plan
          </Link>
          <Link
            href="/shopping"
            className="anime-btn text-xl text-center"
            style={{ background: "var(--anime-green)" }}
          >
            🛒 Shopping List
          </Link>
        </div>
      </div>
    </main>
  );
}
