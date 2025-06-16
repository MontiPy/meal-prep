"use client";
import { useAuth } from "./AuthContext";
import LoginComponent from "./LoginComponent";

export default function AuthGuard({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <LoginComponent />;
  return children;
}
