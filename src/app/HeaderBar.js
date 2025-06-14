"use client";
import Link from "next/link";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white/95 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {/* App logo (replace with your own if you want) */}
          {/* <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6 text-primary">
            <path
              d="M24 0.757L47.243 24 24 47.243 0.757 24 24 0.757ZM21 35.757V12.243L9.243 24 21 35.757Z"
              fill="currentColor"
            />
          </svg> */}
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">
            MealPrep
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Recipes
          </Link>
          <Link
            href="#"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-800 text-base font-medium hover:text-primary transition"
          >
            Contact
          </Link>
        </nav>
        <div className="flex gap-2">
          <button className="rounded-xl bg-primary text-white text-sm font-bold px-5 py-2 shadow hover:bg-blue-700 transition">
            Sign Up
          </button>
          <button className="rounded-xl bg-gray-100 text-gray-900 text-sm font-bold px-5 py-2 hover:bg-gray-200 transition">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
