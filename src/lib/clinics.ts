export interface Clinic {
  id: string
  name: string
  description: string
  subdomain: string
  logo?: string
  primaryColor?: string
  address?: string
  phone?: string
  email?: string
}

export const clinics: Record<string, Clinic> = {
  test1: {
    id: 'clinic-1',
    name: 'Test Klinik 1',
    description: 'Modern diş hekimliği hizmetleri sunan test kliniği. En son teknolojiler ve uzman kadromuzla hizmetinizdeyiz.',
    subdomain: 'test1',
    primaryColor: '#3B82F6',
    address: 'Test Mahallesi, Test Sokak No:1, İstanbul',
    phone: '+90 212 555 0001',
    email: 'info@test1.com'
  },
  test2: {
    id: 'clinic-2',
    name: 'Test Klinik 2',
    description: 'Aile dostu diş hekimliği merkezi. Çocuklardan yaşlılara kadar tüm yaş gruplarına özel tedavi yöntemleri.',
    subdomain: 'test2',
    primaryColor: '#10B981',
    address: 'Test Mahallesi, Test Sokak No:2, Ankara',
    phone: '+90 312 555 0002',
    email: 'info@test2.com'
  },
  test3: {
    id: 'clinic-3',
    name: 'Test Klinik 3',
    description: 'Lüks diş hekimliği kliniği. VIP hizmet anlayışı ve konforlu tedavi ortamı ile fark yaratıyoruz.',
    subdomain: 'test3',
    primaryColor: '#8B5CF6',
    address: 'Test Mahallesi, Test Sokak No:3, İzmir',
    phone: '+90 232 555 0003',
    email: 'info@test3.com'
  },
  default: {
    id: 'clinic-default',
    name: 'Varsayılan Klinik',
    description: 'Bilinmeyen subdomain için varsayılan klinik sayfası. Lütfen doğru subdomain kullandığınızdan emin olun.',
    subdomain: 'default',
    primaryColor: '#6B7280',
    address: 'Bilinmeyen Adres',
    phone: '+90 000 000 0000',
    email: 'info@default.com'
  }
}

export function getClinicBySubdomain(subdomain: string): Clinic {
  return clinics[subdomain] || clinics.default
}

export function getAllClinics(): Clinic[] {
  return Object.values(clinics)
}

export function isValidSubdomain(subdomain: string): boolean {
  return subdomain in clinics
} 