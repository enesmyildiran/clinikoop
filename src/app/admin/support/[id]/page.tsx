"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaPaperPlane, FaUser, FaClock, FaTag, FaExclamationTriangle, FaEdit } from "react-icons/fa";

interface Message {
  id: string;
  content: string;
  authorName: string;
  authorType: string;
  createdAt: string;
  isInternal: boolean;
}

interface TicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
  status: { id: string; name: string; color: string };
  priority: { id: string; name: string; color: string };
  category: { id: string; name: string; color: string };
  clinic: { name: string; subdomain: string };
  createdBy: { name: string; email: string };
  assignedTo?: { name: string; email: string };
  messages: Message[];
}

export default function AdminSupportTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);

  useEffect(() => {
    fetchTicket();
    fetchOptions();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${id}`);
      if (!res.ok) throw new Error("Talep detayı yüklenemedi");
      const data = await res.json();
      setTicket(data.ticket);
    } catch (err: any) {
      setError(err.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [statusRes, priorityRes] = await Promise.all([
        fetch('/api/support/statuses'),
        fetch('/api/support/priorities')
      ]);
      if (statusRes.ok) setStatuses(await statusRes.json());
      if (priorityRes.ok) setPriorities(await priorityRes.json());
    } catch (err) {
      console.error('Seçenekler yüklenemedi:', err);
    }
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    try {
      const res = await fetch(`/api/support/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          authorName: 'Destek Ekibi',
          authorType: 'ADMIN'
        })
      });

      if (!res.ok) throw new Error('Mesaj gönderilemedi');
      
      const data = await res.json();
      
      // Mesajı listeye ekle - admin mesajları sağda görünmeli
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, {
                ...data.message,
                authorName: 'Destek Ekibi', // Frontend'de de doğru isim
                authorType: 'ADMIN'
              }],
            }
          : prev
      );
      
      setMessage("");
    } catch (err: any) {
      setError(err.message || 'Mesaj gönderilemedi');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (statusId: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId })
      });

      if (!res.ok) throw new Error('Durum güncellenemedi');
      
      // Ticket'ı yeniden yükle
      fetchTicket();
    } catch (err: any) {
      setError(err.message || 'Durum güncellenemedi');
    }
  };

  const handlePriorityChange = async (priorityId: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priorityId })
      });

      if (!res.ok) throw new Error('Öncelik güncellenemedi');
      
      // Ticket'ı yeniden yükle
      fetchTicket();
    } catch (err: any) {
      setError(err.message || 'Öncelik güncellenemedi');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!ticket) return <div className="text-center py-12 text-gray-500">Talep bulunamadı.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/support"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft />
          Geri
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {ticket.ticketNumber} - {ticket.subject}
          </h1>
          <p className="text-gray-600">
            {ticket.clinic.name} ({ticket.clinic.subdomain})
          </p>
        </div>
        {ticket.isUrgent && (
          <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            ACİL
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel - Ticket Bilgileri */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Talep Bilgileri</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select
                  value={ticket.status.id}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                <select
                  value={ticket.priority.id}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div className="px-3 py-2 bg-gray-50 rounded text-sm">
                  {ticket.category.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturan</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ticket.createdBy.name}</p>
                    <p className="text-xs text-gray-600">{ticket.createdBy.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma</label>
                <p className="text-sm text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Güncelleme</label>
                <p className="text-sm text-gray-600">
                  {new Date(ticket.updatedAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Mesajlar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Mesajlar</h3>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {ticket.messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Henüz mesaj yok.</p>
              ) : (
                ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.authorType === 'ADMIN' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.authorType !== 'ADMIN' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.authorType === 'ADMIN'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {msg.authorType === 'ADMIN' 
                          ? 'Destek Ekibi' 
                          : (msg.authorName === 'Siz' || msg.authorName === 'Klinik Kullanıcısı' 
                             ? ticket.createdBy.name 
                             : msg.authorName)
                        }
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    {msg.authorType === 'ADMIN' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Mesaj Gönderme */}
            <div className="p-6 border-t">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Açıklama</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>
    </div>
  );
} 