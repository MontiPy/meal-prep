import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import HeaderBar from "@/components/HeaderBar";
import { Mochiy_Pop_One, Quicksand } from "next/font/google";

const mochiy = Mochiy_Pop_One({ weight: "400", subsets: ["latin"], variable: "--font-mochiy" });
const quicksand = Quicksand({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-quicksand" });

export const metadata = {
  title: "Meal Prep App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${mochiy.variable} ${quicksand.variable}`}>
      <body>
        <AuthProvider>
          <HeaderBar />
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
