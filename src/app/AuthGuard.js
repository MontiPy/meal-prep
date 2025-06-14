"use client";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user && pathname !== "/login") {
      router.replace("/login");
    }
    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [user, authLoading, pathname, router]);

  if (authLoading) return <div className="p-10 text-center">Loading...</div>;
  return children;
}
