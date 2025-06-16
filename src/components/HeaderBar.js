import Link from "next/link";

export default function HeaderBar() {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/calculator", label: "Calculator" },
    { href: "/plan", label: "Meal Plan" },
    { href: "/shopping", label: "Shopping" },
  ];

  return (
    <header
      className="sticky top-0 z-10 w-full border-b border-gray-100 shadow-sm"
      style={{ background: "var(--anime-card)" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-3">
        <span className="font-extrabold text-lg text-gray-900 tracking-tight font-heading">
          Prep Thy Mealz
        </span>
        {/* Mobile navigation */}
        <nav className="flex gap-3 sm:gap-4 text-sm md:hidden">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
