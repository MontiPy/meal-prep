"use client";
import Link from "next/link";

export default function CalculatorPage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ background: "var(--anime-bg)" }}
    >
      <div className="anime-card text-center">
        <h1 className="text-3xl font-bold mb-4 font-heading">Shopping List</h1>
        <p className="text-lg mb-6">Keep track of ingredients for your meals.</p>
        <Link href="/" className="anime-btn inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
