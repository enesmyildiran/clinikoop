import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const step = searchParams.get('step')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const prometheusUrl = `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`
    
    const response = await fetch(prometheusUrl)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Prometheus API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
} 