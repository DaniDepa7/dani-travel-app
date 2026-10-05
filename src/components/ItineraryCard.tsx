"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Stop {
  id: number;
  place_name: string;
  description: string;
  city: string;
  country: string;
  image_url?: string;
}

interface ItineraryCardProps {
  id: number;
  name: string;
  slug: string;
  stops: Stop[];
}

export default function ItineraryCard({
  name,
  slug,
  stops,
}: ItineraryCardProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedStops = showAll ? stops : stops.slice(0, 3);

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
      <Link href={`/voyages/${slug}`}>
        <h2 className="text-2xl font-bold hover:text-emerald-400 transition-colors cursor-pointer">
          {name}
        </h2>
      </Link>

      <div className="relative border-l-2 border-dashed border-emerald-500/40 pl-6 ml-3 space-y-6">
        <AnimatePresence initial={false}>
          {displayedStops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[31px] top-1.5 bg-emerald-500 w-4 h-4 rounded-full border-4 border-zinc-900 ring-2 ring-emerald-500/20" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-400">
                  {stop.place_name}
                </h3>
                <p className="text-xs text-zinc-400 mb-1">
                  {stop.city}, {stop.country}
                </p>
                <p className="text-sm text-zinc-300 line-clamp-2">
                  {stop.description}
                </p>
                {stop.image_url && (
                  <img
                    src={stop.image_url}
                    alt={stop.place_name}
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {stops.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors w-full text-center"
        >
          {showAll
            ? "Mostra meno"
            : `Mostra altre ${stops.length - 3} tappe (Show more)`}
        </button>
      )}
    </div>
  );
}
