/**
 * Simple rate limiting implementation for API routes
 */

// Store for tracking request counts
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

// In-memory store (will reset on server restart)
const store: RateLimitStore = {};

/**
 * Rate limit configuration
 */
type RateLimitConfig = {
  // Maximum number of requests allowed in the window
  limit: number;
  // Time window in seconds
  windowInSeconds: number;
};

/**
 * Default rate limit configurations
 */
const defaultConfigs: Record<string, RateLimitConfig> = {
  // Default for most API endpoints
  default: {
    limit: 60,
    windowInSeconds: 60, // 60 requests per minute
  },
  // More strict limits for authentication endpoints
  auth: {
    limit: 5,
    windowInSeconds: 60, // 5 requests per minute
  },
};

/**
 * Rate limit result
 */
type RateLimitResult = {
  // Whether the request is allowed
  allowed: boolean;
  // Number of requests remaining in the current window
  remaining: number;
  // When the rate limit will reset (Unix timestamp)
  resetTime: number;
};

/**
 * Check if a request should be rate limited
 * @param key Unique identifier for the rate limit (usually IP address)
 * @param configKey Configuration key to use (default, auth, etc.)
 * @returns Rate limit result
 */
export function checkRateLimit(
  key: string,
  configKey: keyof typeof defaultConfigs = 'default'
): RateLimitResult {
  const config = defaultConfigs[configKey] || defaultConfigs.default;
  const now = Math.floor(Date.now() / 1000);
  
  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime <= now) {
    store[key] = {
      count: 0,
      resetTime: now + config.windowInSeconds,
    };
  }
  
  // Increment count
  store[key].count += 1;
  
  // Check if over limit
  const isAllowed = store[key].count <= config.limit;
  const remaining = Math.max(0, config.limit - store[key].count);
  
  return {
    allowed: isAllowed,
    remaining,
    resetTime: store[key].resetTime,
  };
}

/**
 * Middleware to apply rate limiting to API routes
 * @param request Request object
 * @param configKey Configuration key to use
 * @returns Response if rate limited, null otherwise
 */
export function applyRateLimit(
  request: Request,
  configKey: keyof typeof defaultConfigs = 'default'
): Response | null {
  // Get IP address from headers or connection
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
  
  // Create a unique key based on the IP and the path
  const url = new URL(request.url);
  const key = `${ip}:${url.pathname}`;
  
  // Check rate limit
  const result = checkRateLimit(key, configKey);
  
  if (!result.allowed) {
    // Create rate limit response
    const response = new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': defaultConfigs[configKey].limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': (result.resetTime - Math.floor(Date.now() / 1000)).toString(),
        },
      }
    );
    
    return response;
  }
  
  return null;
}

/**
 * Clean up expired rate limit entries
 * This should be called periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Math.floor(Date.now() / 1000);
  
  for (const key in store) {
    if (store[key].resetTime <= now) {
      delete store[key];
    }
  }
}

// Set up periodic cleanup
if (typeof setInterval !== 'undefined') {
  // Run cleanup every 5 minutes
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
