import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

// 1. Definiamo le interfacce per evitare l'errore su 'any'
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

async function getItineraryBySlug(slug: string): Promise<Itinerary | null> {
  const itineraryResult = await query(
    "SELECT id, name, slug FROM itineraries WHERE slug = $1",
    [slug],
  );
  if (itineraryResult.rows.length === 0) return null;
  const itineraryData = itineraryResult.rows[0];

  const stopsResult = await query(
    "SELECT id, place_name, description, city, country, image_url FROM stops WHERE itinerary_id = $1 ORDER BY order_index ASC",
    [itineraryData.id],
  );

  return {
    id: itineraryData.id,
    name: itineraryData.name,
    slug: itineraryData.slug,
    stops: stopsResult.rows as Stop[],
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function VoyageDetailPage({ params }: Props) {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);
  if (!itinerary) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 max-w-3xl mx-auto space-y-8">
      <Link
        href="/"
        className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        {"← Torna alla Home"}
      </Link>
      <header>
        <h1 className="text-4xl font-extrabold">{itinerary.name}</h1>
        <p className="text-sm text-emerald-400 font-medium mt-1">
          Percorso completo • {itinerary.stops.length} tappe
        </p>
      </header>
      <main className="relative border-l-2 border-emerald-500/30 pl-8 ml-4 space-y-12 pt-4">
        {itinerary.stops.map((stop, index) => (
          <div key={stop.id} className="relative group">
            <span className="absolute -left-[45px] top-1 bg-emerald-500 text-zinc-950 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center border-4 border-zinc-950">
              {index + 1}
            </span>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{stop.place_name}</h2>
                <p className="text-xs font-semibold text-zinc-400 uppercase">
                  {stop.city}, {stop.country}
                </p>
              </div>
              {stop.description && (
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {stop.description}
                </p>
              )}
              {stop.image_url && (
                <img
                  src={stop.image_url}
                  alt={stop.place_name}
                  className="w-full max-h-[350px] object-cover rounded-xl mt-2"
                />
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
