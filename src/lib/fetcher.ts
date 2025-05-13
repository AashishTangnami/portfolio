'use client';

/**
 * Optimized data fetching utilities
 * Implements SWR pattern for efficient data fetching and caching
 */

// Default fetch options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

/**
 * Enhanced fetch function with error handling and type safety
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with typed response data
 */
export async function fetcher<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Perform fetch with error handling
  const response = await fetch(url, mergedOptions);

  // Handle HTTP errors
  if (!response.ok) {
    const error = new Error('API request failed');
    const errorData = await response.json().catch(() => ({}));

    // Attach additional error information
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    (error as any).data = errorData;

    throw error;
  }

  // Parse JSON response
  return response.json();
}

/**
 * Cache for storing fetched data
 */
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Cache expiration time (5 minutes)
 */
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Fetch data with caching (SWR pattern)
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with typed response data
 */
export async function fetchWithCache<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cachedData = cache.get(cacheKey);

  // Return cached data if it exists and is not expired
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
    return cachedData.data as T;
  }

  // Fetch fresh data
  const data = await fetcher<T>(url, options);

  // Cache the result
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Clear the entire cache or a specific entry
 * @param url Optional URL to clear from cache
 */
export function clearCache(url?: string): void {
  if (url) {
    // Clear specific entries that start with the URL
    Array.from(cache.keys()).forEach(key => {
      if (key.startsWith(`${url}-`)) {
        cache.delete(key);
      }
    });
  } else {
    // Clear entire cache
    cache.clear();
  }
}

/**
 * Post data to an API endpoint
 * @param url URL to post to
 * @param data Data to send
 * @param options Additional fetch options
 * @returns Promise with typed response data
 */
export async function postData<T = any, D = any>(
  url: string,
  data: D,
  options: RequestInit = {}
): Promise<T> {
  return fetcher<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Update data at an API endpoint
 * @param url URL to update
 * @param data Data to send
 * @param options Additional fetch options
 * @returns Promise with typed response data
 */
export async function updateData<T = any, D = any>(
  url: string,
  data: D,
  options: RequestInit = {}
): Promise<T> {
  return fetcher<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Delete data at an API endpoint
 * @param url URL to delete from
 * @param options Additional fetch options
 * @returns Promise with typed response data
 */
export async function deleteData<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return fetcher<T>(url, {
    method: 'DELETE',
    ...options,
  });
}
