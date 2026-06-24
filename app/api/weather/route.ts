import { NextResponse } from "next/server";
import { getSeoulWeather } from "@/lib/live-info";

export async function GET() {
  const weather = await getSeoulWeather({ refresh: true });

  return NextResponse.json(weather, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
