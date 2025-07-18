import Link from 'next/link';
import { FaHospital, FaPlus, FaUsers, FaChartBar } from 'react-icons/fa';

// Örnek klinik verisi (ileride API'den gelecek)
const clinics = [
  { id: 1, name: 'Diş Hekimi X', userCount: 5, patientCount: 120, offerCount: 45 },
  { id: 2, name: 'Yıldız Ağız ve Diş Kliniği', userCount: 3, patientCount: 80, offerCount: 30 },
];

export default function ClinicManagementPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHospital className="text-blue-600" /> Klinik Yönetimi
        </h1>
        <Link href="/admin/clinics/new" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <FaPlus /> Yeni Klinik Ekle
        </Link>
      </div>

      {/* Klinik Listesi */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Klinikler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Klinik Adı</th>
                <th className="px-4 py-2 text-left">Kullanıcı Sayısı</th>
                <th className="px-4 py-2 text-left">Hasta Sayısı</th>
                <th className="px-4 py-2 text-left">Teklif Sayısı</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">{clinic.name}</td>
                  <td className="px-4 py-2">{clinic.userCount}</td>
                  <td className="px-4 py-2">{clinic.patientCount}</td>
                  <td className="px-4 py-2">{clinic.offerCount}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/admin/clinics/${clinic.id}`} className="text-blue-600 hover:underline font-medium">Detay</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 