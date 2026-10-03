"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ItineraryListItem {
  id: number;
  name: string;
  slug: string;
  stop_count: number;
}

export default function VoyagesList({
  initialItineraries,
}: {
  initialItineraries: ItineraryListItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = initialItineraries.filter((it) =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Cerca un itinerario..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
      />
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link
                href={`/voyage/${it.slug}`}
                className="group flex justify-between items-center p-5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                    {it.name}
                  </h3>
                  <p className="text-xs text-zinc-500">/voyage/{it.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-1 rounded-full">
                    {it.stop_count} tappe
                  </span>
                  <span className="text-zinc-600 group-hover:text-emerald-400 transition-all">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
