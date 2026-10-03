import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoyageArt - Itinerari Artistici",
  description:
    "Crea e visualizza percorsi e tappe di viaggio in modo artistico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${inter.className} bg-zinc-950 text-white min-h-screen antialiased`}
      >
        {/* La Navbar rimane fissa in cima a tutte le pagine */}
        <Navbar />

        {/* Contenuto specifico della pagina caricata */}
        {children}
      </body>
    </html>
  );
}
