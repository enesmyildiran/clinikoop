import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, packages: [] });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Package created' });
} 