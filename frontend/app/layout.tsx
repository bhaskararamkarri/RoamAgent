import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBS RoamAgent — Intelligent Multi-Leg Travel Concierge",
  description:
    "Next-generation agentic AI travel concierge turning natural-language bus requests into ranked, feasible multi-leg itineraries with deterministic replanning and safety consent gates.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "TBS RoamAgent — Intelligent Multi-Leg Travel Concierge",
    description: "Deterministic multi-leg travel planning for Vizag ⇄ Hyderabad corridor.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-neutral-950 text-neutral-50 font-sans antialiased selection:bg-emerald-500/30 selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}