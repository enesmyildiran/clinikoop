"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: { name: string; color: string };
  category: { name: string; color: string };
  priority: { name: string; color: string };
  createdAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/support/tickets');
      if (!res.ok) throw new Error('Destek talepleri yüklenemedi');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Destek Taleplerim</h1>
        <Link
          href="/site/support/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Yeni Talep
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Henüz destek talebiniz yok.<br />
          <Link href="/site/support/new" className="text-blue-600 hover:underline">İlk talebinizi oluşturun</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öncelik</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3 text-sm">{ticket.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: ticket.category.color, color: '#fff' }}>{ticket.category.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: ticket.priority.color, color: '#fff' }}>{ticket.priority.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: ticket.status.color, color: '#fff' }}>{ticket.status.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/site/support/${ticket.id}`} className="text-blue-600 hover:underline text-sm">Detay</Link>
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