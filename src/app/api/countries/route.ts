import { NextResponse } from 'next/server';
import { getSupportedCountries } from '../services/worldBank';

export async function GET() {
  try {
    const countries = await getSupportedCountries();
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error in GET /api/countries:", error);
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
