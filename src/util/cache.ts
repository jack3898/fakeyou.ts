import { log } from './log.js';

const cacheMap = new Map<string, { expiry: number; data: unknown }>();

/**
 * Using a key, cache the result of an async function!
 *
 * Global cache use only. I.e. data that is useful for the entire lifetime of the application that just needs an occasional refresh.
 * If you find yourself making the key dynamic, this cache is not the tool to use.
 */
export async function cache<T>(key: string, operation: () => Promise<T>, expiresInSeconds = 600): Promise<T> {
	const cacheItem = cacheMap.get(key);

	if (cacheItem && cacheItem.expiry > Date.now()) {
		log.info(`Cache hit for key ${key}`);

		return cacheItem.data as T;
	}

	log.warn(`Cache miss for key ${key}`);

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
