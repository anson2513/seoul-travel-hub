import { NextResponse } from "next/server";
import { getSeoulOutdoorWeather } from "@/lib/live-info";

export async function GET() {
  try {
    const weather = await getSeoulOutdoorWeather();

    return NextResponse.json(weather, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load itinerary weather" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
