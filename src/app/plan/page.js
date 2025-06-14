"use client";
import Link from "next/link";

export default function CalculatorPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">BMR & TDEE Calculator</h1>
      {/* Your calculator form goes here */}
      <Link href="/dashboard" className="mt-10 underline text-blue-600">
        ← Back to Dashboard
      </Link>
    </main>
  );
}
