import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Frontend API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
}
