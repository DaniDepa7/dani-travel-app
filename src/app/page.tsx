import { query } from "@/lib/db";
import ItineraryCard from "@/components/ItineraryCard";

// Definiamo le interfacce per far felice TypeScript ed ESLint
interface Stop {
  id: number;
  place_name: string;
  description: string;
  city: string;
  country: string;
  image_url?: string;
}

interface Itinerary {
  id: number;
  name: string;
  slug: string;
  stops: Stop[];
}

async function getLatestItineraries(): Promise<Itinerary[]> {
  // Prende gli ultimi 5 itinerari inseriti
  const itineraryResult = await query(
    "SELECT id, name, slug FROM itineraries ORDER BY created_at DESC LIMIT 5",
  );
  const itineraries = itineraryResult.rows as Omit<Itinerary, "stops">[];

  const fullItineraries: Itinerary[] = [];

  // Per ciascuno recupera le tappe ordinate
  for (const itinerary of itineraries) {
    const stopsResult = await query(
      "SELECT id, place_name, description, city, country, image_url FROM stops WHERE itinerary_id = \$1 ORDER BY order_index ASC",
      [itinerary.id],
    );

    fullItineraries.push({
      ...itinerary,
      stops: stopsResult.rows as Stop[],
    });
  }
  return fullItineraries;
}

export default async function HomePage() {
  const latestItineraries = await getLatestItineraries();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 max-w-4xl mx-auto space-y-8">
      <header className="border-b border-zinc-800 pb-6 mt-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Diari di Viaggio
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {"Gli ultimi percorsi e itinerari artistici condivisi."}
        </p>
      </header>

      <main className="space-y-8">
        {latestItineraries.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-12">
            {
              "Nessun itinerario presente nel database. Vai in Dashboard per creare il tuo primo viaggio!"
            }
          </p>
        ) : (
          latestItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              id={itinerary.id}
              name={itinerary.name}
              slug={itinerary.slug}
              stops={itinerary.stops}
            />
          ))
        )}
      </main>
    </div>
  );
}
