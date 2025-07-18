'use client';

import { useState, useEffect } from 'react';

interface AnalyticsPageProps {
  searchParams: { clinic?: string };
}

interface AnalyticsFilters {
  clinicId?: string;
  dataTypes: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  pageSize: number;
}

interface AnalyticsData {
  clinicStats?: any[];
  activeUsers?: any[];
  recentActivities?: any[];
  analyticsEvents?: any[];
  financialData?: any[];
  appointmentStats?: any[];
  reminderStats?: any[];
  clinicComparison?: any[];
}

export default function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    clinicId: searchParams.clinic || '',
    dataTypes: [],
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
      end: new Date()
    },
    pageSize: 10
  });

  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Klinikleri yükle
  useEffect(() => {
    fetch('/api/admin/clinics')
      .then(res => res.json())
      .then(data => setClinics(data.clinics || []));
  }, []);

  // Veri tipleri
  const dataTypes = [
    { id: 'clinicStats', label: 'Klinik İstatistikleri', icon: '🏥' },
    { id: 'activeUsers', label: 'En Aktif Kullanıcılar', icon: '👥' },
    { id: 'recentActivities', label: 'Son Aktiviteler', icon: '📝' },
    { id: 'analyticsEvents', label: 'Analitik Eventler', icon: '📊' },
    { id: 'financialData', label: 'Finansal Veriler', icon: '💰' },
    { id: 'appointmentStats', label: 'Randevu İstatistikleri', icon: '📅' },
    { id: 'reminderStats', label: 'Hatırlatma İstatistikleri', icon: '📋' },
    { id: 'clinicComparison', label: 'Klinik Karşılaştırması', icon: '🏆' }
  ];

  // Tarih aralığı seçenekleri
  const dateRangeOptions = [
    { label: 'Son 7 Gün', value: 7 },
    { label: 'Son 30 Gün', value: 30 },
    { label: 'Son 3 Ay', value: 90 },
    { label: 'Son 6 Ay', value: 180 },
    { label: 'Son 1 Yıl', value: 365 },
    { label: 'Özel Aralık', value: 'custom' }
  ];

  // Veri getir
  const fetchData = async () => {
    if (filters.dataTypes.length === 0) {
      setResultInfo({ message: 'Lütfen en az bir veri tipi seçin', type: 'error' });
      return;
    }

    setLoading(true);
    setResultInfo(null);
    
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      
      // Sonuç bilgisi oluştur
      const totalResults = Object.values(result).reduce((total: number, items: any) => {
        return total + (Array.isArray(items) ? items.length : 0);
      }, 0);
      
      const clinicName = filters.clinicId 
        ? clinics.find(c => c.id === filters.clinicId)?.name || 'Seçili Klinik'
        : 'Tüm Klinikler';
      
      if (totalResults > 0) {
        setResultInfo({ 
          message: `${clinicName} için ${totalResults} sonuç listelendi`, 
          type: 'success' 
        });
      } else {
        setResultInfo({ 
          message: `${clinicName} için seçilen kriterlerde sonuç bulunamadı`, 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      setResultInfo({ 
        message: 'Veri getirilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analitik ve Raporlar</h1>
        <p className="text-gray-600 mt-1">Klinik performansları ve sistem aktiviteleri</p>
      </div>

      {/* Filtreleme Formu */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreleme Seçenekleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Klinik Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klinik Seçimi
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.clinicId}
              onChange={(e) => setFilters(prev => ({ ...prev, clinicId: e.target.value }))}
            >
              <option value="">Tüm Klinikler</option>
              {clinics.map(clinic => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tarih Aralığı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih Aralığı
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'custom') {
                  setShowCustomDate(true);
                } else {
                  setShowCustomDate(false);
                  const days = parseInt(value);
                  setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                      end: new Date()
                    }
                  }));
                }
              }}
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sayfa Başına Gösterim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sayfa Başına
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.pageSize}
              onChange={(e) => setFilters(prev => ({ ...prev, pageSize: parseInt(e.target.value) }))}
            >
              <option value={10}>10 Kayıt</option>
              <option value={20}>20 Kayıt</option>
              <option value={50}>50 Kayıt</option>
              <option value={100}>100 Kayıt</option>
            </select>
          </div>

          {/* Sonuç Getir Butonu */}
          <div className="flex items-end">
            <button
              onClick={fetchData}
              disabled={loading || filters.dataTypes.length === 0}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Yükleniyor...' : '📊 Sonuç Getir'}
            </button>
          </div>
        </div>

        {/* Özel Tarih Aralığı */}
        {showCustomDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Özel Tarih Aralığı Seçin
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      start: new Date(e.target.value)
                    }
                  }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      end: new Date(e.target.value)
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Veri Tipi Seçimi */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Görmek İstediğiniz Veriler
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dataTypes.map(type => (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.dataTypes.includes(type.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        dataTypes: [...prev.dataTypes, type.id]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        dataTypes: prev.dataTypes.filter(t => t !== type.id)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type.icon} {type.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuç Bilgisi */}
      {resultInfo && (
        <div className={`p-3 rounded-lg text-sm ${
          resultInfo.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          resultInfo.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {resultInfo.message}
        </div>
      )}

      {/* Sonuçlar */}
      {Object.keys(data).length > 0 && (
        <div className="space-y-6">
          {/* Klinik İstatistikleri */}
          {data.clinicStats && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏥 Klinik İstatistikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.clinicStats.map((stat: any) => (
                  <div key={stat.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                    <div className="text-2xl font-bold text-blue-600">{stat.patientCount}</div>
                    <div className="text-xs text-gray-500">Hasta • {stat.offerCount} Teklif</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* En Aktif Kullanıcılar */}
          {data.activeUsers && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">👥 En Aktif Kullanıcılar</h3>
              <div className="space-y-2">
                {data.activeUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{user.activityCount} aktivite</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Son Aktiviteler */}
          {data.recentActivities && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Son Aktiviteler</h3>
              <div className="space-y-2">
                {data.recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.action === 'CREATE' ? 'bg-green-400' :
                        activity.action === 'UPDATE' ? 'bg-blue-400' :
                        'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                        <div className="text-xs text-gray-500">{activity.userName} • {activity.clinicName}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finansal Veriler */}
          {data.financialData && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Finansal Veriler</h3>
              <div className="space-y-2">
                {data.financialData.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.statusColor }}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.clinicName} • {item.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{item.totalPrice} {item.currency}</div>
                      <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analitik Eventler */}
          {data.analyticsEvents && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Analitik Eventler</h3>
              <div className="space-y-2">
                {data.analyticsEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{event.eventType}</div>
                        <div className="text-xs text-gray-500">{event.userName} • {event.clinicName}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Randevu İstatistikleri */}
          {data.appointmentStats && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📅 Randevu İstatistikleri</h3>
              <div className="space-y-2">
                {data.appointmentStats.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{appointment.appointmentType}</div>
                        <div className="text-xs text-gray-500">{appointment.patientName} • {appointment.doctorName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{appointment.status}</div>
                      <div className="text-xs text-gray-500">{new Date(appointment.startTime).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hatırlatma İstatistikleri */}
          {data.reminderStats && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Hatırlatma İstatistikleri</h3>
              <div className="space-y-2">
                {data.reminderStats.map((reminder: any) => (
                  <div key={reminder.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${reminder.isCompleted ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{reminder.title}</div>
                        <div className="text-xs text-gray-500">{reminder.userName} • {reminder.priority}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{reminder.isCompleted ? 'Tamamlandı' : 'Bekliyor'}</div>
                      <div className="text-xs text-gray-500">{new Date(reminder.dueDate).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Klinik Karşılaştırması */}
          {data.clinicComparison && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏆 Klinik Karşılaştırması</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.clinicComparison.map((clinic: any) => (
                  <div key={clinic.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-2">{clinic.name}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-500">Hasta: <span className="font-medium text-gray-900">{clinic.patientCount}</span></div>
                      <div className="text-gray-500">Teklif: <span className="font-medium text-gray-900">{clinic.offerCount}</span></div>
                      <div className="text-gray-500">Kullanıcı: <span className="font-medium text-gray-900">{clinic.userCount}</span></div>
                      <div className="text-gray-500">Aktivite: <span className="font-medium text-gray-900">{clinic.activityCount}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Veri yoksa */}
      {Object.keys(data).length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Veri Seçin ve Analiz Edin</h3>
          <p className="text-gray-500">Yukarıdaki filtreleme seçeneklerini kullanarak istediğiniz verileri görüntüleyin.</p>
        </div>
      )}
    </div>
  );
} 