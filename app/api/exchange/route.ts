import { NextResponse } from "next/server";
import { getKrwTwdRate } from "@/lib/live-info";

export async function GET() {
  const exchange = await getKrwTwdRate({ refresh: true });

  return NextResponse.json(exchange, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
