import { NextResponse } from "next/server";
// Aggiunge l'import per la gestione della cache
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-\$)+/g, "");

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name, slug FROM itineraries ORDER BY name ASC",
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nel recupero degli itinerari" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Il nome è obbligatorio" },
        { status: 400 },
      );
    }
    const slug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;
    const result = await query(
      "INSERT INTO itineraries (name, slug) VALUES (\$1, \$2) RETURNING *",
      [name, slug],
    );
    // le 3 righe qui sotto servono per svuotare la cache su Vercel
    revalidatePath("/"); // Forza l'aggiornamento della Home Page
    revalidatePath("/voyages"); // Forza l'aggiornamento della pagina Esplora itinerari
    revalidatePath("/dashboard"); // Forza l'aggiornamento della Dashboard

    return NextResponse.json(result.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nel salvataggio" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name || !name.trim()) {
      return NextResponse.json(
        { error: "ID e nome obbligatori" },
        { status: 400 },
      );
    }
    const newSlug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;
    const result = await query(
      "UPDATE itineraries SET name = \$1, slug = \$2 WHERE id = \$3 RETURNING *",
      [name, newSlug, id],
    );
    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not trovato" }, { status: 404 });
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nella modifica" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID richiesto" }, { status: 400 });

    const result = await query("DELETE FROM itineraries WHERE id = \$1", [id]);
    if (result.rowCount === 0)
      return NextResponse.json({ error: "Non trovato" }, { status: 404 });

    //Le 4 righe qui sotto servono per pulire la cache di Vercel
    revalidatePath("/"); // Aggiorna la Home
    revalidatePath("/voyages"); // Aggiorna la pagina Esplora Itinerari
    revalidatePath("/dashboard"); // Aggiorna la Dashboard
    revalidatePath("/voyage/[slug]", "layout"); // Pulisce le pagine dei singoli itinerari

    return NextResponse.json({ message: "Itinerario eliminato con successo" });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nell'eliminazione" },
      { status: 500 },
    );
  }
}
