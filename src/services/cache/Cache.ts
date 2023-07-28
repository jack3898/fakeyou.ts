import { LRUCache } from 'lru-cache';
import crypto from 'node:crypto';
import * as log from '../../util/log.js';
import sizeof from '../../util/sizeof.js';

/**
 * The key to used to identify the cached data.
 *
 * Keys:
 * - `login` - The login response from the FakeYou API.
 * - `fetch-category-model-relationships` - The relationships between categories and models.
 * - `fetch-categories` - All of the categories from the FakeYou API.
 * - `fetch-user-profile-[username]` - The profile of a user. The profile username is appended to the key.
 * - `fetch-user-comments-[username]` - The comments on a user's profile. The profile username is appended to the key.
 * - `fetch-leaderboard` - The FakeYou leaderboards.
 * - `fetch-v2v-models` - All of the V2V models from the FakeYou API.
 * - `fetch-tts-models` - All of the TTS models from the FakeYou API.
 */
export type CacheKey =
	| 'login'
	| 'fetch-category-model-relationships'
	| 'fetch-categories'
	| `fetch-user-profile-${string}`
	| `fetch-user-comments-${string}`
	| 'fetch-leaderboard'
	| 'fetch-v2v-models'
	| 'fetch-tts-models';

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
export class Cache {
	/**
	 * The namespace to use for the cache.
	 *
	 * NOTE: Will be removed in the future as it is not needed.
	 */
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
	 * Wrap an async function with a cache.
	 *
	 * If the cache is empty, the async function will be run and the result will be stored in the cache.
	 * If the cache is not empty, the async function will not be run and the result will be returned from the cache.
	 *
	 * This is useful for caching data that is expensive to fetch, such as data from the FakeYou API.
	 *
	 * @param key The key to used to identify the cached data.
	 * @param operation The async function to run if the cache is empty.
	 * @returns The result of the async function.
	 */
	async wrap<T>(key: CacheKey, operation: () => Promise<T>): Promise<T> {
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

	/**
	 * Invalidate a cache item, so that it will be fetched again the next time it is requested.
	 *
	 * @param key The key to used to identify the cached data.
	 * @returns Whether the cache item was invalidated.
	 */
	dispose(key: CacheKey): boolean {
		const namespacedKey = `${this.namespace}:${key}`;

		return this.lruCache.delete(namespacedKey);
	}

	/**
	 * Invalidate all cache items.
	 * This will cause all cache items to be fetched again the next time they are requested.
	 */
	disposeAll(): void {
		return this.lruCache.clear();
	}
}
