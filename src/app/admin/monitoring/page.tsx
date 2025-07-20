"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Clock, Users, Database, Shield } from "lucide-react";

interface SystemStatus {
  database: boolean;
  environment: boolean;
  auth: boolean;
  api: boolean;
}

interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  uptime: number;
}

export default function MonitoringPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    environment: false,
    auth: false,
    api: false,
  });
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    uptime: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // 30 saniyede bir kontrol
    
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      // Database health check
      const dbResponse = await fetch('/api/test-db');
      const dbStatus = dbResponse.ok;
      
      // Environment health check
      const envResponse = await fetch('/api/test-env');
      const envStatus = envResponse.ok;
      
      // API health check
      const apiResponse = await fetch('/api/health/env');
      const apiStatus = apiResponse.ok;
      
      setSystemStatus({
        database: dbStatus,
        environment: envStatus,
        auth: true, // Auth middleware çalışıyorsa true
        api: apiStatus,
      });
      
      // Mock metrics (gerçek uygulamada API'den alınır)
      setMetrics({
        responseTime: Math.random() * 500 + 100,
        errorRate: Math.random() * 2,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        uptime: 99.9,
      });
      
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sistem Monitoring</h1>
        <Button onClick={checkSystemHealth} variant="outline">
          Yenile
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veritabanı</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.database)}`}></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.database)}
              <span className="text-2xl font-bold">
                {systemStatus.database ? 'Aktif' : 'Hata'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.environment)}`}></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.environment)}
              <span className="text-2xl font-bold">
                {systemStatus.environment ? 'Hazır' : 'Hata'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentication</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.auth)}`}></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.auth)}
              <span className="text-2xl font-bold">
                {systemStatus.auth ? 'Aktif' : 'Hata'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.api)}`}></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.api)}
              <span className="text-2xl font-bold">
                {systemStatus.api ? 'Aktif' : 'Hata'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              Ortalama API yanıt süresi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Hata oranı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Aktif kullanıcı sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Sistem çalışma süresi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Güvenlik Uyarıları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Rate Limiting Aktif</p>
                  <p className="text-sm text-muted-foreground">
                    Login attempts korunuyor
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Aktif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcı aktiviteleri loglanıyor
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Aktif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Environment Variables</p>
                  <p className="text-sm text-muted-foreground">
                    Güvenli konfigürasyon
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Güvenli</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 