"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  color: string;
}
interface Priority {
  id: string;
  name: string;
  color: string;
}

export default function NewSupportTicketPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    subject: '',
    description: '',
    categoryId: '',
    priorityId: '',
    isUrgent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, priRes] = await Promise.all([
        fetch('/api/support/categories'),
        fetch('/api/support/priorities')
      ]);
      if (!catRes.ok || !priRes.ok) throw new Error('Seçenekler yüklenemedi');
      setCategories(await catRes.json());
      setPriorities(await priRes.json());
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      // TODO: Klinik ve kullanıcı id'si ile gönderilmeli (şimdilik sabit)
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          clinicId: 'default_clinic',
          createdById: 'cmd6affvt0001911cfmdczj4x'
        })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Talep oluşturulamadı');
      setSuccess(true);
      setTimeout(() => router.push('/support'), 1200);
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Destek Talebi</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 min-h-[100px]"
            required
            maxLength={1000}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seçiniz</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Öncelik</label>
            <select
              name="priorityId"
              value={form.priorityId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seçiniz</option>
              {priorities.map((pri) => (
                <option key={pri.id} value={pri.id}>{pri.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isUrgent"
            checked={form.isUrgent}
            onChange={handleChange}
            id="urgent"
            className="h-4 w-4 text-red-600 border-gray-300 rounded"
          />
          <label htmlFor="urgent" className="text-sm">Acil (kritik durumlar için)</label>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Talebiniz başarıyla oluşturuldu!</div>}
        <div className="flex justify-between items-center">
          <Link href="/support" className="text-gray-500 hover:underline">İptal</Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={submitting || loading}
          >
            {submitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
} 