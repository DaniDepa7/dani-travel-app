"use client";

import { useState, useEffect } from "react";

interface Itinerary {
  id: number;
  name: string;
  slug: string;
}

interface Stop {
  id: number;
  itinerary_id: number;
  place_name: string;
  description: string;
  city: string;
  country: string;
  image_url?: string;
}

export default function Dashboard() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null,
  );
  const [stops, setStops] = useState<Stop[]>([]);

  // Stati dei Form
  const [newItineraryName, setNewItineraryName] = useState("");
  const [editingStop, setEditingStop] = useState<Partial<Stop> | null>(null);

  const fetchItineraries = async () => {
    const res = await fetch("/api/itineraries");
    if (res.ok) {
      const data = await res.json();
      setItineraries(data);
    }
  };

  const fetchStops = async (itineraryId: number) => {
    const res = await fetch(`/api/stops?itinerary_id=${itineraryId}`);
    if (res.ok) {
      const data = await res.json();
      setStops(data);
    }
  };

  // Forza il caricamento iniziale dei viaggi dal database
  useEffect(() => {
    const loadItineraries = async () => {
      await fetchItineraries();
    };
    loadItineraries();
  }, []);

  // Forza il caricamento delle tappe quando selezioni un viaggio
  useEffect(() => {
    const loadStops = async () => {
      if (selectedItinerary) {
        await fetchStops(selectedItinerary.id);
      } else {
        setStops([]);
      }
    };
    loadStops();
  }, [selectedItinerary]);

  // Creazione Itinerario
  const handleCreateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();

    // Controlliamo che il campo non sia vuoto o composto solo da spazi
    if (!newItineraryName || !newItineraryName.trim()) return;

    const res = await fetch("/api/itineraries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItineraryName }),
    });

    if (res.ok) {
      setNewItineraryName("");
      // Usiamo l'await per forzare la lista ad aggiornarsi prima di procedere
      await fetchItineraries();
    }
  };

  // Cancellazione itinerario
  const handleDeleteItinerary = async (id: number) => {
    if (
      !confirm(
        "Vuoi davvero eliminare questo itinerario e tutte le sue tappe collegate?",
      )
    )
      return;

    const res = await fetch(`/api/itineraries?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedItinerary?.id === id) {
        setSelectedItinerary(null);
        setNewItineraryName("");
      }
      await fetchItineraries();
    }
  };

  // Modifica il nome di un itinerario
  const handleUpdateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItinerary || !newItineraryName.trim()) return;

    const res = await fetch("/api/itineraries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedItinerary.id,
        name: newItineraryName,
      }),
    });
    if (res.ok) {
      setNewItineraryName("");
      setSelectedItinerary(null);
      await fetchItineraries();
    }
  };

  // Salva o Modifica Tappa
  const handleSaveStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItinerary || !editingStop) return;

    const isEditing = !!editingStop.id;
    const url = "/api/stops";
    const method = isEditing ? "PUT" : "POST";

    const bodyData = isEditing
      ? editingStop
      : {
          ...editingStop,
          itinerary_id: selectedItinerary.id,
          order_index: stops.length,
        };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      setEditingStop(null);
      fetchStops(selectedItinerary.id);
    }
  };

  // Elimina Tappa
  const handleDeleteStop = async (stopId: number) => {
    if (!confirm("Vuoi davvero eliminare questa tappa?")) return;
    const res = await fetch(`/api/stops?id=${stopId}`, { method: "DELETE" });
    if (res.ok && selectedItinerary) {
      fetchStops(selectedItinerary.id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* COLONNA 1: Gestione Itinerari */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
        <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">
          1. Seleziona o Crea Itinerario
        </h2>

        {/* Form Nuovo Itinerario */}
        <form
          onSubmit={
            selectedItinerary ? handleUpdateItinerary : handleCreateItinerary
          }
          className="space-y-2"
        >
          <input
            type="text"
            placeholder={
              selectedItinerary ? "Modifica nome..." : "Nuovo itinerario..."
            }
            value={newItineraryName}
            onChange={(e) => setNewItineraryName(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg text-sm font-medium"
            >
              {selectedItinerary ? "Salva Nome" : "+ Crea Itinerario"}
            </button>
            {selectedItinerary && (
              <button
                type="button"
                onClick={() => {
                  setSelectedItinerary(null);
                  setNewItineraryName("");
                }}
                className="px-3 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg text-sm"
              >
                Annulla
              </button>
            )}
          </div>
        </form>

        {/* Lista degli Itinerari popolata correttamente */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {itineraries.length === 0 ? (
            <p className="text-sm text-zinc-500 italic py-2">
              {"Nessun itinerario presente."}
            </p>
          ) : (
            itineraries.map((it) => (
              <div key={it.id} className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    setSelectedItinerary(it);
                    setNewItineraryName(it.name);
                  }}
                  className={`flex-1 text-left p-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedItinerary?.id === it.id
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {it.name}
                </button>
                <button
                  onClick={() => handleDeleteItinerary(it.id)}
                  className="p-3 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 text-red-400 rounded-lg transition-colors"
                  title="Elimina itinerario e tutte le tappe"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COLONNA 2: Lista Tappe Attuali */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">
          2. Tappe di: {selectedItinerary?.name || "Nessuno"}
        </h2>

        {selectedItinerary ? (
          <div className="space-y-3">
            <button
              onClick={() =>
                setEditingStop({
                  place_name: "",
                  city: "",
                  country: "",
                  description: "",
                })
              }
              className="w-full py-2 border border-dashed border-zinc-700 hover:border-emerald-500 text-zinc-400 hover:text-emerald-400 rounded-lg text-sm"
            >
              + Aggiungi una tappa a questo itinerario
            </button>

            {stops.map((stop) => (
              <div
                key={stop.id}
                className="p-3 bg-zinc-800 rounded-lg flex justify-between items-start gap-2"
              >
                <div>
                  <h4 className="font-semibold text-sm text-emerald-400">
                    {stop.place_name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {stop.city}, {stop.country}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingStop(stop)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteStop(stop.id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">
            Seleziona un itinerario a sinistra per visualizzare o inserire le
            sue tappe.
          </p>
        )}
      </div>

      {/* COLONNA 3: Form Dettaglio Tappa (Inserimento / Modifica) */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold border-b border-zinc-800 pb-2 mb-4">
          {editingStop?.id ? "Modifica Tappa" : "Nuova Tappa"}
        </h2>

        {editingStop ? (
          <form onSubmit={handleSaveStop} className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                Nome Luogo
              </label>
              <input
                type="text"
                value={editingStop.place_name || ""}
                onChange={(e) =>
                  setEditingStop({ ...editingStop, place_name: e.target.value })
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Città
                </label>
                <input
                  type="text"
                  value={editingStop.city || ""}
                  onChange={(e) =>
                    setEditingStop({ ...editingStop, city: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Nazione
                </label>
                <input
                  type="text"
                  value={editingStop.country || ""}
                  onChange={(e) =>
                    setEditingStop({ ...editingStop, country: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                Descrizione
              </label>
              <textarea
                value={editingStop.description || ""}
                onChange={(e) =>
                  setEditingStop({
                    ...editingStop,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm h-20"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                URL Immagine (Opzionale)
              </label>
              <input
                type="text"
                value={editingStop.image_url || ""}
                onChange={(e) =>
                  setEditingStop({ ...editingStop, image_url: e.target.value })
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium"
              >
                Salva Tappa
              </button>
              <button
                type="button"
                onClick={() => setEditingStop(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
              >
                Annulla
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-zinc-500 italic">
            Clicca su modifica o aggiungi tappa per aprire il form di
            compilazione.
          </p>
        )}
      </div>
    </div>
  );
}
