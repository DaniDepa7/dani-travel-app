import { query } from "@/lib/db";
import VoyagesList from "@/components/VoyagesList";

async function getAllItineraries() {
  const result = await query(
    "SELECT i.id, i.name, i.slug, COUNT(s.id)::int as stop_count FROM itineraries i LEFT JOIN stops s ON i.id = s.itinerary_id GROUP BY i.id ORDER BY i.name ASC",
  );
  return result.rows;
}

export default async function VoyagesPage() {
  const itineraries = await getAllItineraries();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 max-w-4xl mx-auto space-y-8">
      <header className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Tutti gli Itinerari
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {"Sfoglia l'archivio completo dei tuoi viaggi salvati."}
        </p>
      </header>
      <main>
        <VoyagesList initialItineraries={itineraries} />
      </main>
    </div>
  );
}
