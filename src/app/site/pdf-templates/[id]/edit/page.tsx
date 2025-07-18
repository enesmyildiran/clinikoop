"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { FaSave, FaArrowLeft, FaDownload } from "react-icons/fa";

const SAMPLE_DATA = {
  clinic: { name: "Diş Kliniği", address: "Adres...", phone: "0212 123 45 67", email: "info@klinik.com" },
  patient: { name: "Ahmet Yılmaz", phone: "0555 123 45 67", email: "ahmet@example.com" },
  offer: { grandTotal: "12.500", currency: "₺" },
  treatments: [
    { name: "İmplant", teeth: "11, 12", price: "7.500" },
    { name: "Dolgu", teeth: "24", price: "1.500" },
    { name: "Kanal Tedavisi", teeth: "36", price: "3.500" },
  ],
};

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

export default function EditPdfTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [template, setTemplate] = useState<PdfTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/pdf-templates/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setTemplate(data.data);
          setName(data.data.name);
          setDescription(data.data.description || "");
          setCode(data.data.content);
        } else {
          addToast({ message: "Şablon yüklenemedi", type: "error" });
          router.push("/pdf-templates");
        }
      } catch (e) {
        addToast({ message: "Bir hata oluştu", type: "error" });
        router.push("/pdf-templates");
      }
      setLoading(false);
    };
    fetchTemplate();
  }, [params.id, router, addToast]);

  function renderTemplate(template: string, data: any) {
    let html = template;
    html = html.replace(/{{clinic.name}}/g, data.clinic.name);
    html = html.replace(/{{patient.name}}/g, data.patient.name);
    html = html.replace(/{{patient.phone}}/g, data.patient.phone);
    html = html.replace(/{{patient.email}}/g, data.patient.email);
    html = html.replace(/{{offer.grandTotal}}/g, data.offer.grandTotal);
    html = html.replace(/{{offer.currency}}/g, data.offer.currency);
    html = html.replace(/{{#each treatments}}([\s\S]*?){{\/each}}/, (_, row) => {
      return data.treatments.map((t: any) =>
        row
          .replace(/{{name}}/g, t.name)
          .replace(/{{teeth}}/g, t.teeth)
          .replace(/{{price}}/g, t.price)
      ).join("");
    });
    return html;
  }

  const previewHtml = `
    <div style="width:794px; height:1123px; background:white; margin:auto; box-shadow:0 0 16px #0002; overflow:auto;">
      ${renderTemplate(code, SAMPLE_DATA)}
    </div>
  `;

  const handleSave = async () => {
    if (!name.trim()) {
      addToast({ message: "Şablon adı gerekli", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/pdf-templates/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          content: code,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ message: "Şablon başarıyla güncellendi", type: "success" });
        router.push("/pdf-templates");
      } else {
        addToast({ message: data.error || "Güncelleme başarısız", type: "error" });
      }
    } catch (e) {
      addToast({ message: "Bir hata oluştu", type: "error" });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-8 px-4 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">PDF Şablonunu Düzenle</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Şablon Adı *</label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Şablon adını girin" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Açıklama</label>
        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Şablon açıklaması" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">HTML Şablonu</label>
        <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-64 p-2 border rounded font-mono text-sm" placeholder="HTML şablonunuzu buraya yazın..." />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
        <Button variant="outline" onClick={() => router.push("/pdf-templates")}>Geri</Button>
      </div>
    </div>
  );
} 