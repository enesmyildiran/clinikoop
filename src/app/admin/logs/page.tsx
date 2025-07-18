'use client';

import { useState, useEffect } from 'react';

interface LogsPageProps {
  searchParams: { clinic?: string };
}

interface LogsFilters {
  clinicId?: string;
  logTypes: string[];
  logLevels: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  pageSize: number;
  searchTerm: string;
}

interface LogsData {
  activityLogs?: any[];
  systemLogs?: any[];
  analyticsEvents?: any[];
  errorLogs?: any[];
  userActivities?: any[];
}

export default function LogsPage({ searchParams }: LogsPageProps) {
  const [filters, setFilters] = useState<LogsFilters>({
    clinicId: searchParams.clinic || '',
    logTypes: [],
    logLevels: [],
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Son 7 gün
      end: new Date()
    },
    pageSize: 20,
    searchTerm: ''
  });

  const [data, setData] = useState<LogsData>({});
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Klinikleri yükle
  useEffect(() => {
    fetch('/api/admin/clinics')
      .then(res => res.json())
      .then(data => setClinics(Array.isArray(data) ? data : []));
  }, []);

  // Log tipleri
  const logTypes = [
    { id: 'activityLogs', label: 'Aktivite Logları', icon: '📝' },
    { id: 'systemLogs', label: 'Sistem Logları', icon: '⚠️' },
    { id: 'analyticsEvents', label: 'Analitik Eventler', icon: '📊' },
    { id: 'errorLogs', label: 'Hata Logları', icon: '❌' },
    { id: 'userActivities', label: 'Kullanıcı Aktiviteleri', icon: '👤' }
  ];

  // Log seviyeleri
  const logLevels = [
    { id: 'INFO', label: 'Bilgi', color: 'text-blue-600' },
    { id: 'WARNING', label: 'Uyarı', color: 'text-yellow-600' },
    { id: 'ERROR', label: 'Hata', color: 'text-red-600' },
    { id: 'CRITICAL', label: 'Kritik', color: 'text-red-800' }
  ];

  // Tarih aralığı seçenekleri
  const dateRangeOptions = [
    { label: 'Son 1 Gün', value: 1 },
    { label: 'Son 7 Gün', value: 7 },
    { label: 'Son 30 Gün', value: 30 },
    { label: 'Son 3 Ay', value: 90 },
    { label: 'Son 6 Ay', value: 180 },
    { label: 'Özel Aralık', value: 'custom' }
  ];

  // Logları getir
  const fetchLogs = async () => {
    if (filters.logTypes.length === 0) {
      setResultInfo({ message: 'Lütfen en az bir log tipi seçin', type: 'error' });
      return;
    }

    setLoading(true);
    setResultInfo(null);
    
    try {
      const response = await fetch('/api/admin/logs', {
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
          message: `${clinicName} için ${totalResults} log kaydı listelendi`, 
          type: 'success' 
        });
      } else {
        setResultInfo({ 
          message: `${clinicName} için seçilen kriterlerde log kaydı bulunamadı`, 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Log getirme hatası:', error);
      setResultInfo({ 
        message: 'Loglar getirilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Log seviyesi rengi
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-600 bg-blue-50';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50';
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'CRITICAL': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Log action rengi
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-50';
      case 'UPDATE': return 'text-blue-600 bg-blue-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      case 'LOGIN': return 'text-purple-600 bg-purple-50';
      case 'LOGOUT': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Logları</h1>
        <p className="text-gray-600 mt-1">Sistem aktiviteleri ve hata takibi</p>
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
              defaultValue="7"
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

          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arama
            </label>
            <input
              type="text"
              placeholder="Log içeriğinde ara..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
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
                      start: new Date(e.target.value + 'T00:00:00')
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
                      end: new Date(e.target.value + 'T23:59:59')
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Log Tipi Seçimi */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Log Tipleri
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {logTypes.map(type => (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.logTypes.includes(type.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        logTypes: [...prev.logTypes, type.id]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        logTypes: prev.logTypes.filter(t => t !== type.id)
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

        {/* Log Seviyesi Seçimi */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Log Seviyeleri
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {logLevels.map(level => (
              <label key={level.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.logLevels.includes(level.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        logLevels: [...prev.logLevels, level.id]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        logLevels: prev.logLevels.filter(l => l !== level.id)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${level.color}`}>{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sonuç Getir Butonu */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchLogs}
            disabled={loading || filters.logTypes.length === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Yükleniyor...' : '📋 Logları Getir'}
          </button>
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
          {/* Aktivite Logları */}
          {data.activityLogs && data.activityLogs.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Aktivite Logları</h3>
              <div className="space-y-2">
                {data.activityLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{log.description}</div>
                        <div className="text-xs text-gray-500">
                          {log.userName} • {log.clinicName} • {log.entityType}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sistem Logları */}
          {data.systemLogs && data.systemLogs.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Sistem Logları</h3>
              <div className="space-y-2">
                {data.systemLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{log.message}</div>
                        <div className="text-xs text-gray-500">{log.category}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analitik Eventler */}
          {data.analyticsEvents && data.analyticsEvents.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Analitik Eventler</h3>
              <div className="space-y-2">
                {data.analyticsEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600">
                        {event.eventType}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{event.eventName || 'İsimsiz Event'}</div>
                        <div className="text-xs text-gray-500">
                          {event.userName || 'Bilinmeyen Kullanıcı'} • {event.clinicName || 'Bilinmeyen Klinik'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(event.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hata Logları */}
          {data.errorLogs && data.errorLogs.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Hata Logları</h3>
              <div className="space-y-2">
                {data.errorLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-red-100 rounded-lg hover:bg-red-50">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600">
                        {log.level}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{log.message}</div>
                        <div className="text-xs text-gray-500">{log.category}</div>
                        {log.stackTrace && (
                          <details className="mt-1">
                            <summary className="text-xs text-red-600 cursor-pointer hover:text-red-700">Stack Trace Göster</summary>
                            <pre className="text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                              {log.stackTrace}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kullanıcı Aktiviteleri */}
          {data.userActivities && data.userActivities.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">👤 Kullanıcı Aktiviteleri</h3>
              <div className="space-y-2">
                {data.userActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                        <div className="text-xs text-gray-500">
                          {activity.userName || 'Bilinmeyen Kullanıcı'} ({activity.userEmail || 'E-posta yok'}) • {activity.clinicName || 'Bilinmeyen Klinik'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(activity.createdAt).toLocaleString('tr-TR')}
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
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Log Seçin ve İnceleyin</h3>
          <p className="text-gray-500">Yukarıdaki filtreleme seçeneklerini kullanarak istediğiniz logları görüntüleyin.</p>
        </div>
      )}
    </div>
  );
} 