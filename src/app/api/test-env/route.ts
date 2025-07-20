import { getEnvironmentInfo } from '@/lib/env-validation';

/**
 * Environment Variables Test Endpoint
 * 
 * Bu endpoint, environment variables'ların durumunu kontrol eder.
 * Production'da sensitive bilgileri göstermez.
 */
export async function GET() {
  try {
    const envInfo = getEnvironmentInfo();
    
    // Production'da sensitive bilgileri gizle
    if (process.env.NODE_ENV === 'production') {
      return Response.json({
        status: 'success',
        nodeEnv: envInfo.nodeEnv,
        databaseUrl: envInfo.databaseUrl,
        nextAuthUrl: envInfo.nextAuthUrl ? 'Set' : 'Not Set',
        nextAuthSecret: envInfo.nextAuthSecret,
        mainDomain: envInfo.mainDomain,
        baseUrl: envInfo.baseUrl,
        validation: {
          isValid: envInfo.validation.isValid,
          missing: envInfo.validation.missing,
          invalid: envInfo.validation.invalid,
          warnings: envInfo.validation.warnings
        },
        message: 'Environment variables checked successfully'
      });
    }

    // Development'da tüm bilgileri göster
    return Response.json({
      status: 'success',
      environment: envInfo,
      message: 'Environment variables checked successfully (development mode)'
    });

  } catch (error) {
    return Response.json({
      status: 'error',
      message: 'Failed to check environment variables',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 