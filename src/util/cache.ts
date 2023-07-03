import { LRUCache } from 'lru-cache';
import { log } from './log.js';
import sizeof from './sizeof.js';

const cacheMap = new LRUCache<string, NonNullable<unknown>>({
	max: 5000, // Max amount of objects
	ttl: 1000 * 60 * 10, // 10 mins
	maxSize: 5e8, // 500MB
	sizeCalculation(value): number {
		const size = sizeof(value);

		return size > 0 ? size : Number.MAX_SAFE_INTEGER; // Max safe int is just another way of saying "don't store it"
	}
});

/**
 * Using a key, cache the result of an async function!
 *
 * Global cache use only. I.e. data that is useful for the entire lifetime of the application that just needs an occasional refresh.
 * If you find yourself making the key dynamic, this cache is not the tool to use.
 */
export async function cache<T>(key: string, operation: () => Promise<T>): Promise<T> {
	const cacheItem = cacheMap.get(key);

	if (cacheItem) {
		log.info(`Cache hit for key ${key}`);

		return cacheItem as T;
	}

	log.warn(`Cache miss for key ${key}`);

	const freshData = await operation();

	if (freshData) {
		cacheMap.set(key, freshData);
	}

	return freshData;
}

export function dispose(key: string): boolean {
	return cacheMap.delete(key);
}
