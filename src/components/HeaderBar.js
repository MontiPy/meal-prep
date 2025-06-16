"use client";
import Link from "next/link";

export default function HeaderBar() {
  return (
    <header
      className="sticky top-0 z-10 w-full border-b border-gray-100 shadow-sm"
      style={{ background: "var(--anime-card)" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <span className="font-extrabold text-lg text-gray-900 tracking-tight font-heading">
          Prep Thy Mealz
        </span>
        {/* Mobile navigation */}
        <nav className="flex gap-4 text-sm md:hidden">
          <Link href="/" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/calculator" className="hover:underline">
            Calculator
          </Link>
          <Link href="/plan" className="hover:underline">
            Meal Plan
          </Link>
          <Link href="/shopping" className="hover:underline">
            Shopping
          </Link>
        </nav>
      </div>
    </header>
  );
}
