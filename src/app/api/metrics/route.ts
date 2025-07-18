import { NextRequest, NextResponse } from 'next/server'
import { collectMetrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    const metrics = await collectMetrics()
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Metrics collection error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 