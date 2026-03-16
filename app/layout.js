import { AuthProvider } from "@/context/AuthContext";
import NotificationProvider from "@/components/NotificationProvider";
import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://bstock.com"),

  title: {
    default: "BStock — Supply Chain Investment Platform",
    template: "%s | BStock",
  },

  description:
    "BStock connects investors with surplus inventory opportunities from global suppliers. Invest in real supply chains and manage your portfolio through a secure dashboard.",

  keywords: [
    "BStock",
    "supply chain investment",
    "inventory sourcing",
    "surplus inventory",
    "investment dashboard",
    "supply platform",
  ],

  openGraph: {
    title: "BStock — Supply Chain Investment Platform",
    description:
      "Invest in surplus inventory opportunities and manage your portfolio through the BStock dashboard.",
    url: "https://bstock.com",
    siteName: "BStock",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BStock Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BStock — Supply Chain Investment Platform",
    description:
      "Access surplus inventory opportunities and manage investments through BStock.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
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
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
