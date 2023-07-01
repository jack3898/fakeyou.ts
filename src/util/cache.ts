const cacheMap = new Map<string, { expiry: number; data: unknown }>();

/**
 * Using a key, cache the result of an async function!
 *
 * NOTE: Global cache use only. I.e. data that is useful for tne entire lifetime of the application.
 * E.g. models, categories etc.
 */
export async function cache<T>(key: string, operation: () => Promise<T>, expiresInSeconds = 600): Promise<T> {
	const cacheItem = cacheMap.get(key);

	if (cacheItem && cacheItem.expiry > Date.now()) {
		return cacheItem.data as T;
	}

	const freshData = await operation();

	cacheMap.set(key, {
		expiry: Date.now() + expiresInSeconds * 1000,
		data: freshData
	});

	return freshData;
}

export function dispose(key: string): boolean {
	return cacheMap.delete(key);
}
