"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserCreateGate } from "@/components/PermissionGate";

export default function UsersListPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Kullanıcılar yüklenemedi');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Kullanıcılar yüklenemedi");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    setSuccess("");
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess("Kullanıcı silindi");
    } else {
      setError("Silme işlemi başarısız");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sistem Kullanıcıları</h1>
        <UserCreateGate>
          <Link
            href="/admin/users/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Yeni Kullanıcı
          </Link>
        </UserCreateGate>
      </div>
      
      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded">{error}</div>}
      {success && <div className="text-green-600 mb-4 p-3 bg-green-50 border border-green-200 rounded">{success}</div>}
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Kullanıcılar yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">Ad Soyad</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">E-posta</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">Klinik</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">Rol</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">Durum</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">Kayıt Tarihi</th>
                <th className="p-3 border border-gray-200 text-left font-medium text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">{u.name}</td>
                  <td className="p-3 border border-gray-200">{u.email}</td>
                  <td className="p-3 border border-gray-200">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {u.clinic?.name || "Klinik Atanmamış"}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                      u.role === 'ADMIN' ? 'bg-orange-100 text-orange-800' :
                      u.role === 'SALES' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {u.role === 'SUPER_ADMIN' ? 'Sistem Yöneticisi' :
                       u.role === 'ADMIN' ? 'Klinik Yöneticisi' :
                       u.role === 'SALES' ? 'Satış' :
                       u.role === 'DOCTOR' ? 'Doktor' :
                       u.role === 'ASSISTANT' ? 'Asistan' : u.role}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/users/${u.id}/edit`} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Düzenle
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => handleDelete(u.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz kullanıcı bulunmuyor
            </div>
          )}
        </div>
      )}
    </div>
  );
} 