"use client";
import Link from "next/link";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg">
            Hello,{" "}
            <span className="font-semibold">
              {user?.displayName || user?.email}
            </span>
          </span>
          <button
            onClick={() => signOut(auth)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Sign Out
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8">What would you like to do?</h1>
        <div className="flex flex-col gap-6">
          <Link
            href="/calculator"
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xl text-center shadow"
          >
            BMR/TDEE Calculator
          </Link>
          <Link
            href="/plan"
            className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl text-center shadow"
          >
            Meal Plan
          </Link>
          <Link
            href="/shopping"
            className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-xl text-center shadow"
          >
            Shopping List
          </Link>
        </div>
      </div>
    </main>
  );
}
