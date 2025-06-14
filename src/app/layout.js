import "./globals.css";
import { AuthProvider } from "./AuthContext";
import AuthGuard from "./AuthGuard";

export const metadata = {
  title: "Meal Prep App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
