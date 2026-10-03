"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
          >
            VoyageArt 🗺️
          </motion.span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              isActive("/")
                ? "text-emerald-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Home
          </Link>

          <Link
            href="/voyages"
            className={`transition-colors ${
              isActive("/voyages")
                ? "text-emerald-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Esplora Itinerari
          </Link>

          <Link
            href="/dashboard"
            className={`px-4 py-1.5 rounded-lg border transition-all ${
              isActive("/dashboard")
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400"
            }`}
          >
            Pannello Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
