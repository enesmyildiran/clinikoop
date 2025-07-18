#!/bin/bash

# Clinikoop Proje Yedekleme Scripti
# Kullanım: ./backup.sh [yedek_adı]

# Yedek adı belirlenir
if [ -z "$1" ]; then
    BACKUP_NAME="clinikoop_backup_$(date +%Y%m%d_%H%M%S)"
else
    BACKUP_NAME="clinikoop_$1_$(date +%Y%m%d_%H%M%S)"
fi

# Yedekleme dizini oluştur
BACKUP_DIR="backups/$BACKUP_NAME"
mkdir -p "$BACKUP_DIR"

echo "🧪 Clinikoop projesi yedekleniyor: $BACKUP_NAME"

# 1. Veritabanı yedeği
echo "📊 Veritabanı yedekleniyor..."
cp prisma/dev.db "$BACKUP_DIR/database.db"

# 2. Proje dosyaları yedekleniyor (node_modules hariç)
echo "📁 Proje dosyaları yedekleniyor..."
rsync -av --exclude='node_modules' --exclude='.next' --exclude='backups' --exclude='.git' . "$BACKUP_DIR/project/"

# 3. Package.json ve lock dosyaları
echo "📦 Bağımlılık dosyaları yedekleniyor..."
cp package.json package-lock.json "$BACKUP_DIR/"

# 4. Environment dosyası
echo "🔐 Environment dosyası yedekleniyor..."
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/"
fi

# 5. Prisma schema ve migrations
echo "🗄️ Prisma dosyaları yedekleniyor..."
cp -r prisma "$BACKUP_DIR/"

# 6. Yedekleme raporu oluştur
echo "📋 Yedekleme raporu oluşturuluyor..."
cat > "$BACKUP_DIR/backup_info.txt" << EOF
Clinikoop Proje Yedeği
======================

Yedekleme Tarihi: $(date)
Yedek Adı: $BACKUP_NAME
Proje Versiyonu: $(node -p "require('./package.json').version" 2>/dev/null || echo "Bilinmiyor")

Yedeklenen Bileşenler:
- Veritabanı (SQLite)
- Proje kaynak kodları
- Bağımlılık dosyaları
- Environment ayarları
- Prisma schema ve migrations

Yedek Boyutu: $(du -sh "$BACKUP_DIR" | cut -f1)

Geri Yükleme Talimatları:
1. Yeni bir dizin oluşturun
2. Bu yedek dosyalarını kopyalayın
3. npm install çalıştırın
4. npx prisma generate çalıştırın
5. Veritabanını geri yükleyin: cp database.db prisma/dev.db

Not: Bu yedek sadece geliştirme ortamı içindir.
EOF

# 7. Yedekleme tamamlandı
echo "✅ Yedekleme tamamlandı!"
echo "📂 Yedek konumu: $BACKUP_DIR"
echo "📊 Yedek boyutu: $(du -sh "$BACKUP_DIR" | cut -f1)"

# 8. Sıkıştırma seçeneği
read -p "Yedeği sıkıştırmak ister misiniz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗜️ Yedek sıkıştırılıyor..."
    tar -czf "$BACKUP_DIR.tar.gz" -C backups "$BACKUP_NAME"
    echo "✅ Sıkıştırılmış yedek: $BACKUP_DIR.tar.gz"
    echo "🗑️ Orijinal klasör siliniyor..."
    rm -rf "$BACKUP_DIR"
fi

echo "🎉 Yedekleme işlemi başarıyla tamamlandı!" 