import { NextRequest, NextResponse } from 'next/server';

// Basit in-memory rate limiting (production'da Redis kullanılmalı)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimitService {
  static async checkRateLimit(
    key: string, 
    maxRequests: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
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
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime
    };
  }
  
  static async getRemainingRequests(key: string): Promise<number> {
    const record = rateLimitStore.get(key);
    if (!record || Date.now() > record.resetTime) {
      return 5; // Default max requests
    }
    return Math.max(0, 5 - record.count);
  }
  
  static async resetRateLimit(key: string): Promise<void> {
    rateLimitStore.delete(key);
  }
  
  // Clean up expired records periodically
  static cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => rateLimitStore.delete(key));
  }
}

// Clean up every 5 minutes
setInterval(() => {
  RateLimitService.cleanup();
}, 5 * 60 * 1000);

// Helper function for API routes
export function withRateLimit(
  handler: Function, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000
) {
  return async (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const key = `rate_limit:${ip}`;
    
    const rateLimit = await RateLimitService.checkRateLimit(key, maxRequests, windowMs);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
          resetTime: rateLimit.resetTime 
        }, 
        { status: 429 }
      );
    }
    
    // Add rate limit headers
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    
    return response;
  };
} 