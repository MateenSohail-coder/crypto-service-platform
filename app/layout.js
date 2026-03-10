import { AuthProvider } from "@/context/AuthContext";
import "./styles/globals.css";

export const metadata = {
  title: "NexVault — Crypto Dashboard",
  description: "Manage your crypto investments with NexVault",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#07070f] text-white antialiased"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
