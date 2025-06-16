import Link from "next/link";

export default function PlanLayout({ children }) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <nav className="flex gap-4 p-4 bg-gray-100 border-b mb-4 text-sm">
        <Link href="/plan" className="hover:underline">
          Meal Plan
        </Link>
        <Link href="/plan/ingredients" className="hover:underline">
          Ingredient Library
        </Link>
        <Link href="/plan/recipes" className="hover:underline">
          Recipe Builder
        </Link>
      </nav>
      {children}
    </div>
  );
}
