"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaPaperPlane, FaUser, FaClock, FaTag, FaExclamationTriangle } from "react-icons/fa";

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
  status: { name: string; color: string };
  priority: { name: string; color: string };
  category: { name: string; color: string };
  clinic: { name: string };
  createdBy: { name: string; email: string };
  messages: Message[];
}

export default function SupportTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
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
          authorName: 'Klinik Kullanıcısı', // TODO: Gerçek kullanıcı adı
          authorType: 'CLINIC_USER'
        })
      });

      if (!res.ok) throw new Error('Mesaj gönderilemedi');
      
      const data = await res.json();
      
      // Mesajı listeye ekle
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, {
                ...data.message,
                authorName: 'Siz', // Frontend'de kullanıcıya "Siz" olarak göster
                authorType: 'CLINIC_USER'
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

  if (loading) return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!ticket) return <div className="text-center py-12 text-gray-500">Talep bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/support"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft />
          Geri
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {ticket.ticketNumber} - {ticket.subject}
          </h1>
          <p className="text-gray-600">Destek talebi detayları</p>
        </div>
      </div>

      {/* Ticket Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Talep Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaTag className="text-gray-400" />
                <span className="text-sm text-gray-600">Kategori:</span>
                <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: ticket.category.color, color: '#fff' }}>
                  {ticket.category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-gray-400" />
                <span className="text-sm text-gray-600">Öncelik:</span>
                <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: ticket.priority.color, color: '#fff' }}>
                  {ticket.priority.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <span className="text-sm text-gray-600">Durum:</span>
                <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: ticket.status.color, color: '#fff' }}>
                  {ticket.status.name}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Oluşturan</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{ticket.createdBy.name}</p>
                <p className="text-sm text-gray-600">{ticket.createdBy.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-2">Açıklama</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Mesajlar */}
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
                  msg.authorType === 'ADMIN' ? 'justify-start' : 'justify-end'
                }`}
              >
                {msg.authorType === 'ADMIN' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-blue-600 text-sm" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.authorType === 'ADMIN'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {msg.authorName}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleString('tr-TR')}
                  </div>
                </div>
                {msg.authorType !== 'ADMIN' && (
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
  );
} 