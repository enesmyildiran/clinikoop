"use client";
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUser, FaEnvelope, FaShieldAlt, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import { PageContainer } from '@/components/ui/PageContainer'

const roles = {
  'SUPER_ADMIN': { label: 'Sistem Yöneticisi', color: 'bg-red-100 text-red-800' },
  'ADMIN': { label: 'Klinik Yöneticisi', color: 'bg-orange-100 text-orange-800' },
  'SALES': { label: 'Satış', color: 'bg-blue-100 text-blue-800' },
  'DOCTOR': { label: 'Doktor', color: 'bg-green-100 text-green-800' },
  'ASSISTANT': { label: 'Asistan', color: 'bg-purple-100 text-purple-800' },
  'USER': { label: 'Kullanıcı', color: 'bg-gray-100 text-gray-800' },
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Kullanıcılar yüklenemedi');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "Kullanıcılar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'active') return user.isActive;
    if (filter === 'inactive') return !user.isActive;
    if (filter === 'admin') return user.role === 'ADMIN';
    return true;
  });
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
        <div className="text-sm text-gray-500">
          Kullanıcı ekleme işlemi sadece sistem yöneticisi tarafından yapılabilir
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tümü ({users.length})
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aktif ({users.filter(u => u.isActive).length})
          </button>
          <button 
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'inactive' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pasif ({users.filter(u => !u.isActive).length})
          </button>
          <button 
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Yöneticiler ({users.filter(u => u.role === 'ADMIN').length})
          </button>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Kullanıcılar yükleniyor...
          </div>
        ) : (
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
                {filteredUsers.map((user) => (
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roles[user.role as keyof typeof roles]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {roles[user.role as keyof typeof roles]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR') : 'Hiç giriş yapmamış'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:underline mr-3" title="Düzenle">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:underline mr-3" title="Sil">
                        <FaTrash />
                      </button>
                      <button className="text-indigo-600 hover:underline" title="İzinler">
                        <FaShieldAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  )
} 