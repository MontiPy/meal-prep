"use client";
export default function HeaderBar() {
  return (
    <header
      className="sticky top-0 z-10 w-full border-b border-gray-100 shadow-sm"
      style={{ background: "var(--anime-card)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center px-6 py-3">
        <span className="font-extrabold text-lg text-gray-900 tracking-tight font-heading">
          Prep Thy Mealz
        </span>
      </div>
    </header>
  );
}
