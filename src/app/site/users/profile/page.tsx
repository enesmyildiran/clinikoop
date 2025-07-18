"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.replace('/login');
          return;
        }
        setUser(data.user);
        setForm({ name: data.user.name, email: data.user.email, password: "" });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Profil güncellendi");
      setForm((prev) => ({ ...prev, password: "" }));
    } else {
      setError("Güncelleme başarısız");
    }
  };

  if (loading) return <div>Profil yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Profilim</h1>
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
        {user?.clinic && (
          <div>
            <label className="block mb-1 font-medium">Klinik</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={user.clinic.name}
              disabled
            />
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">Rol</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={user?.role || user?.isSuperAdmin ? "Süper Admin" : "-"}
            disabled
          />
        </div>
        {user?.role === "CUSTOM" && user?.permissions && (
          <div>
            <label className="block mb-1 font-medium">İzinler</label>
            <div className="grid grid-cols-2 gap-2">
              {JSON.parse(user.permissions).map((p: string) => (
                <span key={p} className="bg-gray-200 rounded px-2 py-1 text-xs">{p}</span>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">Yeni Şifre</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={handleChange}
            placeholder="Şifreyi değiştirmek için doldurun"
          />
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