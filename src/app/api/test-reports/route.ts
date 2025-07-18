import { NextResponse } from 'next/server'
import { getReports } from '@/lib/reports'

export async function GET() {
  try {
    console.log('🧪 Test API çağrıldı')
    
    const result = await getReports({
      dateFrom: '',
      dateTo: '',
      currency: '',
      salesUserId: '',
      treatmentType: '',
      page: 1,
      pageSize: 1000
    })
    
    console.log('🧪 Test API sonucu:', result)
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('🧪 Test API hatası:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
} 