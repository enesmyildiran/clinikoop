# Clinikoop Hibrit Sistem Planı

## 🎯 Genel Bakış

Hibrit sistem, hem merkezi yönetim hem de klinik özelleştirmesi sağlayan bir yaklaşımdır. Bu sistem sayesinde admin global kategoriler oluşturabilirken, klinikler de kendi özel kategorilerini ekleyebilir.

## 📋 Sistem Mimarisi

### **1. Veri Yapısı**

#### **SupportCategory Model**
```prisma
model SupportCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  description String?
  color       String   @default("#6B7280")
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  isGlobal    Boolean  @default(false)  // Global kategori mi?
  isHidden    Boolean  @default(false)  // Klinik tarafından gizlendi mi?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  clinicId    String?  // Global kategoriler için null
  clinic      Clinic?  @relation(fields: [clinicId], references: [id])

  tickets     SupportTicket[]

  @@map("support_categories")
}
```

#### **SupportPriority Model**
```prisma
model SupportPriority {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  level       Int      @default(1)
  color       String   @default("#6B7280")
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  isDeleted   Boolean  @default(false)
  isGlobal    Boolean  @default(false)  // Global öncelik mi?
  isHidden    Boolean  @default(false)  // Klinik tarafından gizlendi mi?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  clinicId    String?  // Global öncelikler için null
  clinic      Clinic?  @relation(fields: [clinicId], references: [id])

  tickets     SupportTicket[]

  @@map("support_priorities")
}
```

### **2. Kategori Türleri**

#### **Global Kategoriler**
- `isGlobal: true`
- `clinicId: null`
- Admin tarafından oluşturulur
- Tüm kliniklerde görünür
- Silinemez, sadece gizlenebilir

#### **Klinik Kategorileri**
- `isGlobal: false`
- `clinicId: "clinic-id"`
- Klinik tarafından oluşturulur
- Sadece o klinikte görünür
- Silinebilir ve düzenlenebilir

## 🔧 API Route Yapısı

### **1. GET /api/support/categories**
```typescript
// Klinik için kategorileri getir
const categories = await prisma.supportCategory.findMany({
  where: {
    OR: [
      { isGlobal: true, isHidden: false },           // Global kategoriler
      { clinicId: userClinicId, isGlobal: false }    // Klinik kategorileri
    ],
    isActive: true
  },
  orderBy: [
    { isGlobal: 'desc' },  // Global kategoriler önce
    { order: 'asc' }
  ]
});
```

### **2. POST /api/support/categories**
```typescript
// Admin global kategori oluşturur
if (isAdmin) {
  await prisma.supportCategory.create({
    data: {
      name,
      displayName,
      description,
      isGlobal: true,
      clinicId: null
    }
  });
}

// Klinik kendi kategorisini oluşturur
else {
  await prisma.supportCategory.create({
    data: {
      name,
      displayName,
      description,
      isGlobal: false,
      clinicId: userClinicId
    }
  });
}
```

### **3. PUT /api/support/categories/[id]**
```typescript
// Global kategoriler sadece admin tarafından düzenlenebilir
// Klinik kategorileri sadece o klinik tarafından düzenlenebilir
```

### **4. DELETE /api/support/categories/[id]**
```typescript
// Global kategoriler silinemez, sadece gizlenebilir
if (category.isGlobal) {
  await prisma.supportCategory.update({
    where: { id },
    data: { isHidden: true }
  });
} else {
  // Klinik kategorileri silinebilir
  await prisma.supportCategory.delete({ where: { id } });
}
```

## 🎨 Frontend Yapısı

### **1. Admin Paneli**

#### **Global Kategoriler Yönetimi**
```typescript
// Admin sadece global kategorileri görebilir ve yönetebilir
const globalCategories = categories.filter(cat => cat.isGlobal);

// Global kategori oluşturma formu
const createGlobalCategory = async (data) => {
  await fetch('/api/support/categories', {
    method: 'POST',
    body: JSON.stringify({ ...data, isGlobal: true })
  });
};
```

#### **Klinik Kategorileri Görüntüleme**
```typescript
// Admin tüm kliniklerin kategorilerini görebilir
const clinicCategories = categories.filter(cat => !cat.isGlobal);
```

### **2. Klinik Paneli**

#### **Kategori Seçimi**
```typescript
// Klinik hem global hem kendi kategorilerini görebilir
const availableCategories = categories.filter(cat => 
  (cat.isGlobal && !cat.isHidden) || 
  (cat.clinicId === userClinicId)
);
```

#### **Kendi Kategorilerini Yönetme**
```typescript
// Klinik sadece kendi kategorilerini oluşturabilir
const createClinicCategory = async (data) => {
  await fetch('/api/support/categories', {
    method: 'POST',
    body: JSON.stringify({ ...data, isGlobal: false })
  });
};
```

## 🔐 Yetki Yönetimi

### **Admin Yetkileri**
- ✅ Global kategori oluşturma
- ✅ Global kategori düzenleme
- ✅ Global kategori gizleme
- ✅ Tüm klinik kategorilerini görme
- ❌ Global kategori silme
- ❌ Klinik kategorilerini düzenleme

### **Klinik Yetkileri**
- ✅ Kendi kategorilerini oluşturma
- ✅ Kendi kategorilerini düzenleme
- ✅ Kendi kategorilerini silme
- ✅ Global kategorileri gizleme
- ❌ Global kategorileri düzenleme
- ❌ Diğer klinik kategorilerini görme

## 📊 Veri Akışı

### **1. Kategori Oluşturma**
```
Admin → Global Kategori → Tüm Kliniklerde Görünür
Klinik → Klinik Kategorisi → Sadece O Klinikte Görünür
```

### **2. Kategori Güncelleme**
```
Admin → Global Kategori Güncelle → Tüm Kliniklerde Güncellenir
Klinik → Kendi Kategorisini Güncelle → Sadece O Klinikte Güncellenir
```

### **3. Kategori Silme/Gizleme**
```
Admin → Global Kategori Gizle → Tüm Kliniklerde Gizlenir
Klinik → Kendi Kategorisini Sil → Sadece O Klinikten Silinir
```

## 🚀 Uygulama Adımları

### **Faz 1: Schema Güncellemesi**
1. Prisma schema'ya `isGlobal` ve `isHidden` alanları ekle
2. `clinicId` alanını opsiyonel yap
3. Migration oluştur

### **Faz 2: API Route Güncellemesi**
1. GET endpoint'ini hibrit yapıya uyarla
2. POST endpoint'ini yetki kontrolü ile güncelle
3. PUT/DELETE endpoint'lerini yetki kontrolü ile güncelle

### **Faz 3: Frontend Güncellemesi**
1. Admin panelinde global kategori yönetimi
2. Klinik panelinde hibrit kategori görüntüleme
3. Yetki bazlı UI kontrolleri

### **Faz 4: Test ve Optimizasyon**
1. Performans testleri
2. Güvenlik testleri
3. Kullanıcı deneyimi testleri

## 📈 Avantajlar

### **Merkezi Yönetim**
- Tutarlı kategori yapısı
- Kolay güncelleme
- Standartlaştırma

### **Klinik Özelleştirmesi**
- İhtiyaca özel kategoriler
- Esneklik
- Bağımsızlık

### **Güvenlik**
- Yetki bazlı erişim
- Veri izolasyonu
- Güvenli işlemler

## ⚠️ Dikkat Edilecekler

### **Performans**
- Karmaşık sorgular
- İndeksleme ihtiyacı
- Cache stratejisi

### **Veri Tutarlılığı**
- Global kategori isimleri benzersiz olmalı
- Klinik kategori isimleri klinik içinde benzersiz olmalı
- Referans bütünlüğü

### **Kullanıcı Deneyimi**
- Kategori türlerini ayırt etme
- Yetki mesajları
- Hata yönetimi

---

**Son Güncelleme**: 17 Ocak 2025
**Versiyon**: 1.0
**Durum**: Planlama Aşaması 