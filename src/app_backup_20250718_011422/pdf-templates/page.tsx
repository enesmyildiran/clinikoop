"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FaFilePdf, FaEdit, FaTrash, FaPlus, FaStar, FaEye } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";

interface PdfTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  isDefault: boolean;
  isFixed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PdfTemplatesPage() {
  const [templates, setTemplates] = useState<PdfTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { addToast } = useToast();
  const router = useRouter();

  // Şablonları getir
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf-templates");
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      } else {
        setError(data.error || "Şablonlar yüklenemedi.");
      }
    } catch (e) {
      setError("Bir hata oluştu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Varsayılan yap
  const handleSetDefault = async (id: string) => {
    setSelectedId(id);
    await fetch("/api/pdf-templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isDefault: true }),
    });
    fetchTemplates();
    setSelectedId(null);
    addToast({
      message: "Varsayılan şablon güncellendi",
      type: "success"
    });
  };

  // Sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;
    setSelectedId(id);
    await fetch(`/api/pdf-templates?id=${id}`, { method: "DELETE" });
    fetchTemplates();
    setSelectedId(null);
    addToast({
      message: "Şablon başarıyla silindi",
      type: "success"
    });
  };

  // Önizle (modal veya yeni sekme açılabilir)
  const handlePreview = (template: PdfTemplate) => {
    // Yeni sekmede önizleme sayfası aç
    window.open(`/pdf-templates/${template.id}/preview`, '_blank');
  };

  // Düzenle (modal veya ayrı sayfa)
  const handleEdit = (template: PdfTemplate) => {
    // Düzenleme sayfasına yönlendir
    router.push(`/pdf-templates/${template.id}/edit`);
  };

  const handleCreateNew = () => {
    router.push('/pdf-templates/new');
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PDF Şablonları</h1>
          <p className="text-gray-600 mt-2">
            Burada PDF teklif şablonlarını yönetebilirsiniz. Şablonları önizleyebilir, düzenleyebilir, silebilir veya varsayılan yapabilirsiniz.
          </p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Yeni Şablon
        </button>
      </div>

      {/* Şablon Listesi */}
      <div className="space-y-4">
        {templates.length === 0 && (
          <div className="text-center text-gray-500">Henüz şablon yok.</div>
        )}
        {templates.map((tpl) => (
          <Card key={tpl.id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-2">
            <div className="flex-1">
              <div className="font-semibold text-lg flex items-center gap-2">
                {tpl.name}
                {tpl.isDefault ? (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">Aktif</span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">Pasif</span>
                )}
                {tpl.isFixed && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">Sabit</span>}
              </div>
              {tpl.description && <div className="text-gray-500 text-sm">{tpl.description}</div>}
              <div className="text-xs text-gray-400 mt-1">Oluşturulma: {new Date(tpl.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => handlePreview(tpl)} disabled={selectedId === tpl.id}>Önizle</Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(tpl)} disabled={selectedId === tpl.id}>Düzenle</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tpl.id)} disabled={selectedId === tpl.id} className="text-red-600 border-red-300">Sil</Button>
              {!tpl.isDefault && (
                <Button variant="primary" size="sm" onClick={() => handleSetDefault(tpl.id)} disabled={selectedId === tpl.id}>Varsayılan Yap</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bilgilendirme */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Önemli Notlar</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Sabit şablonlar sistem tarafından korunur ve silinemez</p>
            <p>• Varsayılan şablon değiştirildiğinde, yeni teklifler bu şablonu kullanır</p>
            <p>• Şablon düzenlemeleri mevcut teklifleri etkilemez</p>
            <p>• Yeni şablon oluşturduktan sonra teklif oluşturma sayfasını yenilemeniz gerekebilir</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 