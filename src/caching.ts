const CACHE_NAME = 'map-cache-v1';

export async function cacheUrl(url: string): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(url);

  if (!response) {
    response = await fetch(url);
    cache.put(url, response.clone());
  }

  return response;
}

export async function clearCache(): Promise<void> {
  await caches.delete(CACHE_NAME);
}