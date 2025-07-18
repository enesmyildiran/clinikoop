"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Kullanıcılar yüklenemedi");
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
    <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <Link
          href="/admin/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Yeni Kullanıcı
        </Link>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      {loading ? (
        <div>Kullanıcılar yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Ad Soyad</th>
                <th className="p-2 border">E-posta</th>
                <th className="p-2 border">Klinik</th>
                <th className="p-2 border">Rol</th>
                <th className="p-2 border">Davet Durumu</th>
                <th className="p-2 border">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.clinic?.name || "-"}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">
                    {u.isActive
                      ? "Aktif"
                      : u.inviteToken
                      ? "Davet Bekliyor"
                      : "Pasif"}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="text-red-600 hover:underline mr-2"
                      onClick={() => handleDelete(u.id)}
                    >
                      Sil
                    </button>
                    {/* <Link href={`/admin/users/${u.id}/edit`} className="text-blue-600 hover:underline">Düzenle</Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 