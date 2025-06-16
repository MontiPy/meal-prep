"use client";
import Link from "next/link";

export default function NavSidebar() {
  return (
    <aside className="hidden md:flex w-48 h-screen sticky top-0 border-r bg-gray-50 p-4 flex-col">
      <Link href="/" className="mb-2 hover:underline">
        Dashboard
      </Link>
      <Link href="/calculator" className="mb-2 hover:underline">
        Calculator
      </Link>
      <Link href="/plan" className="mb-2 hover:underline">
        Meal Plan
      </Link>
      <Link href="/shopping" className="hover:underline">
        Shopping List
      </Link>
    </aside>
  );
}
