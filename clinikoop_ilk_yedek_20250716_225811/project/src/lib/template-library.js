/**
 * PDF Şablon Kütüphanesi - CommonJS versiyonu
 * Seed scripti için kullanılır
 */

var TEMPLATE_LIBRARY = [
  // STANDART TEKLİF ŞABLONU
  {
    id: "standard-offer",
    name: "Standart Teklif",
    description: "Genel kullanım için standart teklif şablonu",
    category: "standard",
    version: "1.0.0",
    author: "Clinikoop",
    isDefault: true,
    isFixed: false,
    isPublic: true,
    tags: ["teklif", "standart", "genel"],
    metadata: {
      pageCount: 1,
      orientation: "portrait",
      paperSize: "A4"
    },
    settings: {
      showLogo: true,
      showHeader: true,
      showFooter: true,
      primaryColor: "#3B82F6",
      secondaryColor: "#1F2937",
      fontFamily: "Arial, sans-serif",
      fontSize: 12,
      lineHeight: 1.5,
      margin: 20,
      vatRate: 18
    },
    pages: [
      {
        id: "page-1",
        elements: [
          // Logo
          {
            id: "logo",
            type: "image",
            content: "",
            x: 50,
            y: 50,
            width: 120,
            height: 60,
            style: {
              border: "none"
            }
          },
          // Başlık
          {
            id: "title",
            type: "text",
            content: "TEDAVİ TEKLİFİ",
            x: 200,
            y: 80,
            width: 300,
            height: 30,
            style: {
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: "#1F2937"
            }
          },
          // Hasta Bilgileri
          {
            id: "patient-info",
            type: "text",
            content: "Hasta: {{patient.name}}\nTelefon: {{patient.phone}}\nE-posta: {{patient.email}}",
            x: 50,
            y: 150,
            width: 250,
            height: 80,
            style: {
              fontSize: 12,
              lineHeight: 1.5,
              color: "#374151"
            }
          },
          // Tarih
          {
            id: "date",
            type: "text",
            content: "Tarih: {{currentDate}}",
            x: 350,
            y: 150,
            width: 200,
            height: 20,
            style: {
              fontSize: 12,
              color: "#6B7280"
            }
          },
          // Tedavi Listesi Başlığı
          {
            id: "treatments-header",
            type: "text",
            content: "ÖNERİLEN TEDAVİLER",
            x: 50,
            y: 280,
            width: 500,
            height: 25,
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1F2937",
              borderBottom: "2px solid #3B82F6"
            }
          },
          // Tedavi Listesi
          {
            id: "treatments-list",
            type: "dynamic-list",
            content: "{{#each treatments}}\n{{name}} - {{price}} {{../currency}}\n{{/each}}",
            x: 50,
            y: 320,
            width: 500,
            height: 200,
            style: {
              fontSize: 12,
              lineHeight: 1.8,
              color: "#374151"
            }
          },
          // Toplam
          {
            id: "total",
            type: "text",
            content: "TOPLAM: {{totalPrice}} {{currency}}",
            x: 350,
            y: 550,
            width: 200,
            height: 30,
            style: {
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "right",
              color: "#1F2937",
              borderTop: "2px solid #3B82F6",
              paddingTop: 10
            }
          },
          // Notlar
          {
            id: "notes",
            type: "text",
            content: "Notlar:\n{{notes}}",
            x: 50,
            y: 600,
            width: 500,
            height: 100,
            style: {
              fontSize: 11,
              lineHeight: 1.4,
              color: "#6B7280",
              fontStyle: "italic"
            }
          }
        ],
        width: 595,
        height: 842
      }
    ]
  }
];

module.exports = { TEMPLATE_LIBRARY }; 