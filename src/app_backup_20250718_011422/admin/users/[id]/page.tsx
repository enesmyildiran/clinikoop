"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const ROLES = [
  { value: "SALES", label: "Satışçı" },
  { value: "DOCTOR", label: "Doktor" },
  { value: "SECRETARY", label: "Sekreter" },
  { value: "CUSTOM", label: "Özel Rol (Custom)" },
];

const PERMISSIONS = [
  { value: "patients:view", label: "Hasta Görüntüle" },
  { value: "patients:edit", label: "Hasta Düzenle" },
  { value: "offers:view", label: "Teklif Görüntüle" },
  { value: "offers:edit", label: "Teklif Düzenle" },
  { value: "reminders:manage", label: "Hatırlatıcı Yönet" },
  { value: "notes:manage", label: "Not Yönet" },
];

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "SALES",
    clinicId: "",
    permissions: [] as string[],
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const u = data.user;
        setForm({
          name: u.name,
          email: u.email,
          role: u.role,
          clinicId: u.clinicId,
          permissions: u.role === "CUSTOM" && u.permissions ? JSON.parse(u.permissions) : [],
          isActive: u.isActive,
        });
        setLoading(false);
      });
    fetch("/api/admin/clinics")
      .then((res) => res.json())
      .then((data) => setClinics(data.clinics || []));
  }, [userId]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, value]
          : prev.permissions.filter((p) => p !== value),
      }));
    } else if (type === "radio" && name === "isActive") {
      setForm((prev) => ({ ...prev, isActive: value === "true" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        permissions: form.role === "CUSTOM" ? form.permissions : undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Kullanıcı güncellendi");
    } else {
      setError("Güncelleme başarısız");
    }
  };

  if (loading) return <div>Kullanıcı yükleniyor...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Kullanıcı Detay & Düzenle</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Ad Soyad</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">E-posta</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Klinik</label>
          <select
            name="clinicId"
            className="w-full border rounded px-3 py-2"
            value={form.clinicId}
            onChange={handleChange}
            required
          >
            <option value="">Klinik seçin</option>
            {clinics.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Rol</label>
          <select
            name="role"
            className="w-full border rounded px-3 py-2"
            value={form.role}
            onChange={handleChange}
            required
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {form.role === "CUSTOM" && (
          <div>
            <label className="block mb-1 font-medium">İzinler</label>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map((p) => (
                <label key={p.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={p.value}
                    checked={form.permissions.includes(p.value)}
                    onChange={handleChange}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">Durum</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isActive"
                value="true"
                checked={form.isActive === true}
                onChange={handleChange}
              />
              Aktif
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isActive"
                value="false"
                checked={form.isActive === false}
                onChange={handleChange}
              />
              Pasif
            </label>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
} 