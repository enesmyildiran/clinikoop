"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { FaSave, FaArrowLeft, FaDownload } from "react-icons/fa";

const DEFAULT_TEMPLATE = `<!-- PDF Şablonunuzun HTML'i -->
<div style="padding:32px; font-family:Arial,sans-serif; color:#222;">
  <h1 style="text-align:center; color:#2563eb;">{{clinic.name}} Teklif</h1>
  <h2>Hasta Bilgileri</h2>
  <p><b>Ad Soyad:</b> {{patient.name}}</p>
  <p><b>Telefon:</b> {{patient.phone}}</p>
  <p><b>E-posta:</b> {{patient.email}}</p>
  <h2>Tedavi ve Fiyat Tablosu</h2>
  <table style="width:100%; border-collapse:collapse;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="border:1px solid #ddd; padding:8px;">Tedavi</th>
        <th style="border:1px solid #ddd; padding:8px;">Diş(ler)</th>
        <th style="border:1px solid #ddd; padding:8px; text-align:right;">Fiyat</th>
      </tr>
    </thead>
    <tbody>
      {{#each treatments}}
      <tr>
        <td style="border:1px solid #ddd; padding:8px;">{{name}}</td>
        <td style="border:1px solid #ddd; padding:8px;">{{teeth}}</td>
        <td style="border:1px solid #ddd; padding:8px; text-align:right;">{{price}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <h2 style="text-align:right; margin-top:24px;">Toplam: <span style="color:#2563eb;">{{offer.grandTotal}} {{offer.currency}}</span></h2>
</div>`;

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

export default function NewPdfTemplatePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

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
      const res = await fetch("/api/pdf-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          content: code,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ message: "Şablon başarıyla oluşturuldu", type: "success" });
        router.push("/pdf-templates");
      } else {
        addToast({ message: data.error || "Oluşturma başarısız", type: "error" });
      }
    } catch (e) {
      addToast({ message: "Bir hata oluştu", type: "error" });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Yeni PDF Şablonu Oluştur</h1>
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