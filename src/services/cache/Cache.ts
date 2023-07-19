import { LRUCache } from 'lru-cache';
import * as log from '../../util/log.js';
import sizeof from '../../util/sizeof.js';
import crypto from 'node:crypto';

export class Cache {
	namespace = crypto.randomUUID();

	lruCache = new LRUCache<string, NonNullable<unknown>>({
		max: 5000, // Max amount of objects
		ttl: 1000 * 60 * 10, // 10 mins
		maxSize: 5e8, // 500MB in bytes
		sizeCalculation(value): number {
			const size = sizeof(value); // Get best approx size of any object in bytes

			return size > 0 ? size : Number.MAX_SAFE_INTEGER; // Max safe int is just another way of saying "don't store it"
		}
	});

	/**
	 * Using a key, cache the result of an async function!
	 *
	 * Global cache use only. I.e. data that is useful for the entire lifetime of the application that just needs an occasional refresh.
	 * If you find yourself making the key dynamic, this cache is not the tool to use.
	 *
	 * @param key The key to use for this cache item
	 * @param operation The async function to run if the cache is empty
	 * @returns The result of the async function
	 */
	async wrap<T>(key: string, operation: () => Promise<T>): Promise<T> {
		const namespacedKey = `${this.namespace}:${key}`;
		const cacheItem = this.lruCache.get(namespacedKey);

		if (cacheItem) {
			log.info(`Cache hit for key ${key}`);

			return cacheItem as T;
		}

		log.warn(`Cache miss for key ${key}`);

		const freshData = await operation();

		if (freshData) {
			this.lruCache.set(namespacedKey, freshData);
		}

		return freshData;
	}

	dispose(key: string): boolean {
		const namespacedKey = `${this.namespace}:${key}`;

		return this.lruCache.delete(namespacedKey);
	}

	disposeAll(): void {
		return this.lruCache.clear();
	}
}
