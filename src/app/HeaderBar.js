"use client";
import Link from "next/link";

export default function HeaderBar() {
  return (
    <header
      className="sticky top-0 z-10 w-full border-b border-gray-100 shadow-sm"
      style={{ background: "var(--anime-card)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {/* App logo (replace with your own if you want) */}
          {/* <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6 text-primary">
            <path
              d="M24 0.757L47.243 24 24 47.243 0.757 24 24 0.757ZM21 35.757V12.243L9.243 24 21 35.757Z"
              fill="currentColor"
            />
          </svg> */}
          <span className="font-extrabold text-lg text-gray-900 tracking-tight font-heading">
            MealPrep
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Dashboard
          </Link>
          <Link
            href="/calculator"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Calculator
          </Link>
          <Link
            href="/plan"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Meal Plan
          </Link>
          <Link
            href="/shopping"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Shopping List
          </Link>
        </nav>
      </div>
    </header>
  );
}
