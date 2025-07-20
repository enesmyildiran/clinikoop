/**
 * Environment Variables Validation
 * 
 * Bu dosya, gerekli environment variables'ların varlığını ve geçerliliğini kontrol eder.
 * Production'da eksik veya geçersiz environment variables varsa hata fırlatır.
 */

export interface EnvironmentValidationResult {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
}

/**
 * Environment variables'ları validate eder
 */
export function validateEnvironment(): EnvironmentValidationResult {
  const result: EnvironmentValidationResult = {
    isValid: true,
    missing: [],
    invalid: [],
    warnings: []
  };

  // Zorunlu environment variables
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
  ];

  // Eksik environment variables'ları kontrol et
  for (const key of required) {
    if (!process.env[key]) {
      result.missing.push(key);
      result.isValid = false;
    }
  }

  // DATABASE_URL format kontrolü
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
      result.invalid.push('DATABASE_URL must be a PostgreSQL connection string');
      result.isValid = false;
    }
  }

  // NEXTAUTH_SECRET güvenlik kontrolü
  if (process.env.NEXTAUTH_SECRET) {
    if (process.env.NEXTAUTH_SECRET.length < 32) {
      result.warnings.push('NEXTAUTH_SECRET should be at least 32 characters long for security');
    }
    
    // Development'da basit secret kullanılıyorsa uyarı
    if (process.env.NODE_ENV === 'development' && 
        process.env.NEXTAUTH_SECRET.includes('development')) {
      result.warnings.push('NEXTAUTH_SECRET contains "development" - use a more secure secret in production');
    }
  }

  // NEXTAUTH_URL format kontrolü
  if (process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      result.invalid.push('NEXTAUTH_URL must be a valid URL starting with http:// or https://');
      result.isValid = false;
    }
  }

  // NODE_ENV kontrolü
  if (process.env.NODE_ENV) {
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(process.env.NODE_ENV)) {
      result.invalid.push(`NODE_ENV must be one of: ${validEnvs.join(', ')}`);
      result.isValid = false;
    }
  }

  // Production'da ek kontroller
  if (process.env.NODE_ENV === 'production') {
    // Production'da HTTPS zorunlu
    if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('https://')) {
      result.warnings.push('NEXTAUTH_URL should use HTTPS in production');
    }

    // Production'da güvenli secret kontrolü
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      result.invalid.push('NEXTAUTH_SECRET must be at least 32 characters long in production');
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Environment validation'ı çalıştırır ve hata fırlatır
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  
  if (!result.isValid) {
    const errors = [
      ...result.missing.map(key => `Missing: ${key}`),
      ...result.invalid.map(msg => `Invalid: ${msg}`)
    ];
    
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  // Uyarıları logla
  if (result.warnings.length > 0) {
    console.warn('Environment warnings:', result.warnings);
  }
}

/**
 * Environment variables'ları güvenli şekilde loglar
 */
export function logEnvironmentInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Variables:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not Set');
    console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set');
    console.log('- NEXT_PUBLIC_MAIN_DOMAIN:', process.env.NEXT_PUBLIC_MAIN_DOMAIN);
    console.log('- NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  }
}

/**
 * Environment variables'ları test endpoint'i için hazırlar
 */
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not Set',
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
    mainDomain: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    validation: validateEnvironment()
  };
}

/**
 * Production'da environment validation'ı otomatik çalıştırır
 * Sadece runtime'da çalışır, build sırasında çalışmaz
 */
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  try {
    validateEnvironmentOrThrow();
    console.log('✅ Environment validation passed');
  } catch (error) {
    console.error('❌ Environment validation failed:', error instanceof Error ? error.message : 'Unknown error');
    // Build sırasında process.exit() çağırmayın
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
      process.exit(1);
    }
  }
} 