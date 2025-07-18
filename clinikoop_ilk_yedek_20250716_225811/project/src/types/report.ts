export interface ReportFilters {
  dateFrom?: string
  dateTo?: string
  currency?: string
  salesUserId?: string
  treatmentType?: string
  referralSourceId?: string
  page: number
  pageSize: number
}

export interface ReportOffer {
  id: string
  patientName: string
  patient?: {
    referralSourceId?: string
  }
  treatmentType: string
  amount: number
  currency: string
  status: string
  statusDisplay?: string
  createdAt: string
  salesUser: {
    name: string
  }
  convertedAmount?: number
  originalAmount?: number
  originalCurrency?: string
}

export interface ReportSummary {
  totalOffers: number
  totalSales: number
  conversionRate: number
}

export interface ReportResponse {
  offers: ReportOffer[]
  summary: ReportSummary
  // charts?: ...
} 