"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/ui/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';

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
  const { addToast } = useToast();

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
      
      const catData = await catRes.json();
      const priData = await priRes.json();
      
      setCategories(catData.categories || []);
      setPriorities(priData.priorities || []);
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata');
      addToast({
        message: 'Seçenekler yüklenirken hata oluştu',
        type: 'error'
      });
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
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Talep oluşturulamadı');
      setSuccess(true);
      addToast({
        message: 'Destek talebi başarıyla oluşturuldu',
        type: 'success'
      });
      setTimeout(() => router.push('/site/support'), 1200);
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata');
      addToast({
        message: err.message || 'Destek talebi oluşturulamadı',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
        >
          <FaArrowLeft className="mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Yeni Destek Talebi</h1>
          <p className="text-gray-600">Yeni bir destek talebi oluşturun</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
            <Input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Destek talebi başlığı"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Sorununuzu detaylı olarak açıklayın..."
              required
              maxLength={1000}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <Select name="categoryId" value={form.categoryId} onValueChange={(value) => setForm(f => ({ ...f, categoryId: value }))} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Yükleniyor..." : "Kategori seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
              <Select name="priorityId" value={form.priorityId} onValueChange={(value) => setForm(f => ({ ...f, priorityId: value }))} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Yükleniyor..." : "Öncelik seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((pri) => (
                    <SelectItem key={pri.id} value={pri.id}>{pri.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox
              id="isUrgent"
              name="isUrgent"
              checked={form.isUrgent}
              onCheckedChange={(checked) => setForm(f => ({ ...f, isUrgent: checked as boolean }))}
            />
            <label htmlFor="isUrgent" className="text-sm text-gray-700">Acil (kritik durumlar için)</label>
          </div>
          
          {error && <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
          {success && <div className="text-green-600 text-sm p-3 bg-green-50 border border-green-200 rounded-lg">Talebiniz başarıyla oluşturuldu!</div>}
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              {submitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
} 