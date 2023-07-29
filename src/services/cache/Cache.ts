import { LRUCache } from 'lru-cache';
import * as log from '../../util/log.js';
import sizeof from '../../util/sizeof.js';

/**
 * A cache that can be used to store data for the lifetime of the this object.
 *
 * It uses LRU caching, so it will automatically remove the least recently used items when it reaches its limits.
 * And also has expiries, so it will automatically replace items that have not been used for a while.
 *
 * It's a small wrapper over LRUCache npm package.
 *
 * @see https://www.npmjs.com/package/lru-cache
 */
export class Cache<TKeys extends string> {
	readonly lruCache = new LRUCache<string, NonNullable<unknown>>({
		max: 5000, // Max amount of objects
		ttl: 1000 * 60 * 10, // 10 mins
		maxSize: 5e8, // 500MB in bytes
		sizeCalculation(value): number {
			const size = sizeof(value); // Get best approx size of any object in bytes

			return size > 0 ? size : Number.MAX_SAFE_INTEGER; // Max safe int is just another way of saying "don't store it"
		}
	});

	/**
	 * Wrap an async function with a cache.
	 *
	 * If the cache is empty, the async function will be run and the result will be stored in the cache.
	 * If the cache is not empty, the async function will not be run and the result will be returned from the cache.
	 *
	 * All the cached items are stored by reference, so if you modify the returned cached data, it will also modify the cached data internally.
	 * Nesting this function will also forward those references up the chain, so doing a cache wrap inside a cache wrap is a great way to share data between functions
	 * and avoid unnecessary object creation and garbage collection.
	 *
	 * @param key The key to used to identify the cached data.
	 * @param operation The async function to run if the cache is empty.
	 * @param ttl The time to live of the cached data in milliseconds.
	 * @returns The result of the async function.
	 */
	async wrap<T>(key: TKeys, operation: () => Promise<T>, ttl?: number): Promise<T> {
		const cacheItem = this.lruCache.get(key);

		if (cacheItem) {
			log.info(`Cache hit for key ${key}`);

			return cacheItem as T;
		}

		log.warn(`Cache miss for key ${key}`);

		const freshData = await operation();

		if (freshData) {
			this.lruCache.set(key, freshData, { ttl });
		}

		return freshData;
	}

	/**
	 * Invalidate a cache item, so that it will be fetched again the next time it is requested.
	 *
	 * @param key The key to used to identify the cached data.
	 * @returns Whether the cache item was invalidated.
	 */
	dispose(key: TKeys): boolean {
		return this.lruCache.delete(key);
	}

	/**
	 * Invalidate all cache items.
	 * This will cause all cache items to be fetched again the next time they are requested.
	 */
	disposeAll(): void {
		return this.lruCache.clear();
	}
}
