// Vercel uyumlu rate limiting (Database-based)
import { prisma } from './db';

export class VercelRateLimitService {
  static async checkRateLimit(
    key: string, 
    maxRequests: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    try {
      // Database'de rate limit kaydını kontrol et
      const existingRecord = await prisma.$queryRaw`
        SELECT * FROM rate_limits 
        WHERE key = ${key} AND reset_time > ${new Date(now)}
        LIMIT 1
      ` as any[];
      
      if (existingRecord.length === 0) {
        // İlk istek veya window expired
        await prisma.$executeRaw`
          INSERT INTO rate_limits (key, count, reset_time, created_at)
          VALUES (${key}, 1, ${new Date(resetTime)}, ${new Date()})
          ON CONFLICT (key) DO UPDATE SET
          count = 1,
          reset_time = ${new Date(resetTime)},
          updated_at = ${new Date()}
        `;
        
        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetTime
        };
      }
      
      const record = existingRecord[0];
      
      if (record.count >= maxRequests) {
        // Rate limit exceeded
        return {
          allowed: false,
          remaining: 0,
          resetTime: record.reset_time.getTime()
        };
      }
      
      // Increment count
      await prisma.$executeRaw`
        UPDATE rate_limits 
        SET count = count + 1, updated_at = ${new Date()}
        WHERE key = ${key}
      `;
      
      return {
        allowed: true,
        remaining: maxRequests - (record.count + 1),
        resetTime: record.reset_time.getTime()
      };
      
    } catch (error) {
      console.error('Rate limit error:', error);
      // Hata durumunda izin ver (fail-open)
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime
      };
    }
  }
  
  static async cleanup(): Promise<void> {
    try {
      // Expired records'ları temizle
      await prisma.$executeRaw`
        DELETE FROM rate_limits 
        WHERE reset_time < ${new Date()}
      `;
    } catch (error) {
      console.error('Rate limit cleanup error:', error);
    }
  }
}

// Fallback: Basit in-memory rate limiting (development için)
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export class MemoryRateLimitService {
  static async checkRateLimit(
    key: string, 
    maxRequests: number = 5, 
    windowMs: number = 15 * 60 * 1000
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const record = memoryStore.get(key);
    
    if (!record || now > record.resetTime) {
      memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }
    
    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }
    
    record.count++;
    memoryStore.set(key, record);
    
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime
    };
  }
}

// Environment'a göre rate limiting service seç
export const RateLimitService = process.env.NODE_ENV === 'production' 
  ? VercelRateLimitService 
  : MemoryRateLimitService; 