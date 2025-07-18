import Link from 'next/link'
import { FaPlus, FaUser, FaEnvelope, FaShieldAlt, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'

const users = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@clinikoop.com', 
    role: 'ADMIN', 
    status: 'ACTIVE',
    lastLogin: '2024-06-10 14:30',
    createdAt: '2024-01-15'
  },
  { 
    id: '2', 
    name: 'Sales Manager', 
    email: 'sales@clinikoop.com', 
    role: 'SALES', 
    status: 'ACTIVE',
    lastLogin: '2024-06-10 12:15',
    createdAt: '2024-02-20'
  },
  { 
    id: '3', 
    name: 'Doctor Smith', 
    email: 'doctor@clinikoop.com', 
    role: 'DOCTOR', 
    status: 'ACTIVE',
    lastLogin: '2024-06-09 16:45',
    createdAt: '2024-03-10'
  },
  { 
    id: '4', 
    name: 'Assistant User', 
    email: 'assistant@clinikoop.com', 
    role: 'ASSISTANT', 
    status: 'INACTIVE',
    lastLogin: '2024-06-05 09:20',
    createdAt: '2024-04-05'
  },
]

const roles = {
  'ADMIN': { label: 'Yönetici', color: 'bg-red-100 text-red-800' },
  'SALES': { label: 'Satış', color: 'bg-blue-100 text-blue-800' },
  'DOCTOR': { label: 'Doktor', color: 'bg-green-100 text-green-800' },
  'ASSISTANT': { label: 'Asistan', color: 'bg-purple-100 text-purple-800' },
}

export default function UsersPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
        <Link href="/users/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <FaPlus /> Yeni Kullanıcı
        </Link>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">Tümü</button>
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Aktif</button>
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Pasif</button>
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Yöneticiler</button>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Giriş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roles[user.role as keyof typeof roles].color}`}>
                      {roles[user.role as keyof typeof roles].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'ACTIVE' ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                      {user.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:underline mr-3">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:underline mr-3">
                      <FaTrash />
                    </button>
                    <button className="text-indigo-600 hover:underline">
                      <FaShieldAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 