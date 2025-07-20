import { validateEnvironment } from '@/lib/env-validation';

/**
 * Environment Health Check Endpoint
 * 
 * Bu endpoint, environment variables'ların sağlık durumunu kontrol eder.
 * Monitoring sistemleri için kullanılır.
 */
export async function GET() {
  try {
    const validation = validateEnvironment();
    
    const healthStatus = {
      status: validation.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        databaseUrl: !!process.env.DATABASE_URL,
        nextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: !!process.env.NODE_ENV,
        mainDomain: !!process.env.NEXT_PUBLIC_MAIN_DOMAIN,
        baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL
      },
      validation: {
        isValid: validation.isValid,
        missing: validation.missing,
        invalid: validation.invalid,
        warnings: validation.warnings
      }
    };

    // Health check sonucuna göre status code döndür
    const statusCode = validation.isValid ? 200 : 503;

    return Response.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    return Response.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Environment health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
} 