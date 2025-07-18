import { headers } from 'next/headers';
import { prisma } from './db';

export interface ClinicInfo {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  isActive: boolean;
  maxUsers: number;
  maxPatients: number;
  maxOffers: number;
}

/**
 * Host'tan klinik bilgisini çıkarır
 * Örnek: xkliniği.domain.com -> xkliniği
 */
export function getSubdomainFromHost(host: string): string | null {
  const parts = host.split('.');
  
  // localhost:3000 gibi geliştirme ortamı
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // localhost:3000 -> null (ana domain)
    if (parts.length === 2) {
      return null;
    }
    // subdomain.localhost:3000 -> subdomain
    if (parts.length >= 3) {
      return parts[0];
    }
    return null;
  }

  // Canlı ortam
  // Tek seviye domain (örn: domain.com)
  if (parts.length === 2) {
    return null; // Ana domain
  }
  
  // Subdomain varsa (örn: xkliniği.domain.com)
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

/**
 * Mevcut host'tan subdomain'i alır
 */
export function getCurrentSubdomain(): string | null {
  const headersList = headers();
  const host = headersList.get('host') || '';
  return getSubdomainFromHost(host);
}

/**
 * Subdomain'den clinicId'yi bulur
 */
export async function getClinicIdFromSubdomain(subdomain: string): Promise<string | null> {
  if (!subdomain || subdomain === 'default') {
    return null;
  }

  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        subdomain: subdomain,
        isActive: true,
      },
      select: { id: true }
    });

    return clinic?.id || null;
  } catch (error) {
    console.error('ClinicId bulunamadı:', error);
    return null;
  }
}

/**
 * Mevcut host'tan clinicId'yi alır
 */
export async function getCurrentClinicId(): Promise<string | null> {
  const subdomain = getCurrentSubdomain();
  if (!subdomain) return null;
  
  return await getClinicIdFromSubdomain(subdomain);
}

/**
 * API route'larda clinicId'yi alır (header'dan veya subdomain'den)
 */
export async function getClinicIdFromRequest(request?: Request): Promise<string | null> {
  // Önce header'dan kontrol et
  if (request) {
    const clinicId = request.headers.get('x-clinic-id');
    if (clinicId) {
      return clinicId;
    }
  }
  // Header'da yoksa subdomain'den al
  const subdomainClinicId = await getCurrentClinicId();
  if (subdomainClinicId) {
    return subdomainClinicId;
  }
  // Fallback: Veritabanındaki ilk aktif kliniği döndür
  const fallbackClinic = await prisma.clinic.findFirst({
    where: { isActive: true },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
  });
  return fallbackClinic?.id || null;
}

/**
 * Klinik URL'ini oluşturur
 */
export function getClinicUrl(clinic: ClinicInfo): string {
  if (clinic.domain) {
    return `https://${clinic.domain}`;
  }
  
  // Ana domain'i environment'tan al
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'clinikoop.com';
  return `https://${clinic.subdomain}.${mainDomain}`;
}

/**
 * Ana domain URL'ini oluşturur
 */
export function getMainDomainUrl(): string {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'clinikoop.com';
  return `https://app.${mainDomain}`;
}

/**
 * Klinik erişim kontrolü
 */
export function isClinicAccess(host: string): boolean {
  const subdomain = getSubdomainFromHost(host);
  return subdomain !== null && subdomain !== 'app';
}

/**
 * Süper admin erişim kontrolü
 */
export function isSuperAdminAccess(host: string): boolean {
  const subdomain = getSubdomainFromHost(host);
  return subdomain === null || subdomain === 'app';
} 