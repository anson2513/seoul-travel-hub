import { NextResponse } from "next/server";
import { getTwdKrwRate } from "@/lib/live-info";

export async function GET() {
  const exchange = await getTwdKrwRate({ refresh: true });

  return NextResponse.json(exchange, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
