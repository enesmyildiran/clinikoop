#!/bin/bash

# Clinikoop Proje Geri Yükleme Scripti
# Kullanım: ./restore.sh [yedek_klasörü_veya_dosyası]

if [ -z "$1" ]; then
    echo "❌ Hata: Yedek dosyası veya klasörü belirtilmedi!"
    echo "Kullanım: ./restore.sh [yedek_klasörü_veya_dosyası]"
    echo ""
    echo "Örnekler:"
    echo "  ./restore.sh backups/clinikoop_backup_20250716_225516"
    echo "  ./restore.sh clinikoop_backup_20250716_225516.tar.gz"
    exit 1
fi

BACKUP_PATH="$1"
RESTORE_DIR="restored_$(date +%Y%m%d_%H%M%S)"

echo "🔄 Clinikoop projesi geri yükleniyor..."

# Sıkıştırılmış dosya kontrolü
if [[ "$BACKUP_PATH" == *.tar.gz ]]; then
    echo "🗜️ Sıkıştırılmış yedek açılıyor..."
    mkdir -p "$RESTORE_DIR"
    tar -xzf "$BACKUP_PATH" -C "$RESTORE_DIR"
    BACKUP_CONTENT=$(ls "$RESTORE_DIR")
    BACKUP_PATH="$RESTORE_DIR/$BACKUP_CONTENT"
fi

# Yedek klasörü kontrolü
if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Hata: Yedek klasörü bulunamadı: $BACKUP_PATH"
    exit 1
fi

echo "📂 Yedek konumu: $BACKUP_PATH"

# Mevcut proje yedeği al
echo "💾 Mevcut proje yedekleniyor..."
CURRENT_BACKUP="current_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "backups/$CURRENT_BACKUP"
cp prisma/dev.db "backups/$CURRENT_BACKUP/database.db"
cp package.json package-lock.json "backups/$CURRENT_BACKUP/" 2>/dev/null || true

# Veritabanı geri yükleme
echo "📊 Veritabanı geri yükleniyor..."
if [ -f "$BACKUP_PATH/database.db" ]; then
    cp "$BACKUP_PATH/database.db" prisma/dev.db
    echo "✅ Veritabanı geri yüklendi"
else
    echo "⚠️ Veritabanı dosyası bulunamadı, mevcut veritabanı korunuyor"
fi

# Proje dosyaları geri yükleme
echo "📁 Proje dosyaları geri yükleniyor..."
if [ -d "$BACKUP_PATH/project" ]; then
    # Önemli dosyaları yedekle
    cp package.json "package.json.backup" 2>/dev/null || true
    cp package-lock.json "package-lock.json.backup" 2>/dev/null || true
    
    # Proje dosyalarını geri yükle
    rsync -av --exclude='node_modules' --exclude='.next' --exclude='backups' --exclude='.git' "$BACKUP_PATH/project/" ./
    
    echo "✅ Proje dosyaları geri yüklendi"
else
    echo "⚠️ Proje klasörü bulunamadı"
fi

# Package.json geri yükleme
echo "📦 Bağımlılık dosyaları kontrol ediliyor..."
if [ -f "$BACKUP_PATH/package.json" ]; then
    cp "$BACKUP_PATH/package.json" ./
    cp "$BACKUP_PATH/package-lock.json" ./ 2>/dev/null || true
    echo "✅ Package.json geri yüklendi"
fi

# Environment dosyası geri yükleme
echo "🔐 Environment dosyası kontrol ediliyor..."
if [ -f "$BACKUP_PATH/.env" ]; then
    cp "$BACKUP_PATH/.env" ./
    echo "✅ Environment dosyası geri yüklendi"
fi

# Prisma dosyaları geri yükleme
echo "🗄️ Prisma dosyaları kontrol ediliyor..."
if [ -d "$BACKUP_PATH/prisma" ]; then
    cp -r "$BACKUP_PATH/prisma" ./
    echo "✅ Prisma dosyaları geri yüklendi"
fi

# Bağımlılıkları yeniden yükle
echo "📦 Bağımlılıklar yeniden yükleniyor..."
npm install

# Prisma client'ı yeniden oluştur
echo "🔧 Prisma client yeniden oluşturuluyor..."
npx prisma generate

# Geçici dosyaları temizle
if [ -d "$RESTORE_DIR" ]; then
    rm -rf "$RESTORE_DIR"
fi

echo "✅ Geri yükleme tamamlandı!"
echo "📂 Mevcut proje yedeği: backups/$CURRENT_BACKUP"
echo ""
echo "🔍 Kontrol edilmesi gerekenler:"
echo "1. Uygulama çalışıyor mu? (npm run dev)"
echo "2. Veritabanı bağlantısı çalışıyor mu?"
echo "3. Tüm sayfalar yükleniyor mu?"
echo ""
echo "⚠️ Sorun yaşarsanız mevcut yedeği geri yükleyebilirsiniz:"
echo "   ./restore.sh backups/$CURRENT_BACKUP" 