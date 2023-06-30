export default class Cache {
	static #cacheMap = new Map<string, { expiry: number; data: unknown }>();

	/**
	 * Using a key, cache the result of an async function!
	 */
	static async wrap<T>(key: string, operation: () => Promise<T>, expiresInSeconds = 600): Promise<T> {
		const cacheItem = this.#cacheMap.get(key);

		if (cacheItem && cacheItem.expiry > Date.now()) {
			return cacheItem.data as T;
		}

		const freshData = await operation();

		this.#cacheMap.set(key, {
			expiry: Date.now() + expiresInSeconds * 1000,
			data: freshData
		});

		return freshData;
	}

	static dispose(key: string): boolean {
		return this.#cacheMap.delete(key);
	}
}
