import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itinerary_id = searchParams.get("itinerary_id");
    if (!itinerary_id)
      return NextResponse.json(
        { error: "itinerary_id richiesto" },
        { status: 400 },
      );

    const result = await query(
      "SELECT id, itinerary_id, place_name, description, city, country, image_url, order_index FROM stops WHERE itinerary_id = \$1 ORDER BY order_index ASC",
      [itinerary_id],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nel recupero delle tappe" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      itinerary_id,
      place_name,
      description,
      city,
      country,
      image_url,
      order_index,
    } = await request.json();
    const result = await query(
      `INSERT INTO stops (itinerary_id, place_name, description, city, country, image_url, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        itinerary_id,
        place_name,
        description,
        city,
        country,
        image_url,
        order_index,
      ],
    );
    return NextResponse.json(result.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nell'aggiunta della tappa" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, place_name, description, city, country, image_url } =
      await request.json();
    const result = await query(
      `UPDATE stops SET place_name = $1, description = $2, city = $3, country = $4, image_url = $5 
       WHERE id = $6 RETURNING *`,
      [place_name, description, city, country, image_url, id],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nella modifica della tappa" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query("DELETE FROM stops WHERE id = \$1", [id]);
    return NextResponse.json({ message: "Tappa eliminata con successo" });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nell'eliminazione della tappa" },
      { status: 500 },
    );
  }
}
