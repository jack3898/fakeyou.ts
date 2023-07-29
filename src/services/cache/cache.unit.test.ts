import { afterEach, expect, it, vitest } from 'vitest';
import { Cache } from './Cache.js';

const cache = new Cache<'test-cache-key' | 'test-cache-key-2'>();

afterEach(() => {
	cache.disposeAll();
});

it('should only run cached function once', async () => {
	const cacheMissSpy = vitest.fn().mockReturnValue(true);

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	expect(cacheMissSpy).toHaveBeenCalledOnce();
});

it('should not cache an undefined value', async () => {
	const cacheMissSpy = vitest.fn();

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	expect(cacheMissSpy).toHaveBeenCalledTimes(2);
});

it('should allow for disposal of a cache item', async () => {
	const cacheMissSpy = vitest.fn().mockReturnValue(true);

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	cache.dispose('test-cache-key');

	await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	expect(cacheMissSpy).toHaveBeenCalledTimes(2);
});

it('should return exact same value from reference in memory on cache hit', async () => {
	const cacheMissSpy = vitest.fn().mockReturnValue(true);

	const firstResult = await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	const secondResult = await cache.wrap('test-cache-key', async () => {
		return cacheMissSpy();
	});

	expect(firstResult).toBe(secondResult);
});

it('should return by reference in different and unique calls to wrap', async () => {
	const getMany = async (): Promise<{ obj: true }[]> =>
		await cache.wrap('test-cache-key', async () => {
			return [{ obj: true }];
		});

	const findOneFromMany = (): Promise<{ obj: true }> =>
		cache.wrap('test-cache-key-2', async () => {
			const many = await getMany();

			return many[0];
		});

	const getManyResultInitial = await getMany();
	const getManyResultCache = await getMany();

	const getOneResultInitial = await findOneFromMany();
	const getOneResultCache = await findOneFromMany();

	// NOT toEqual! We want to make sure that the reference is the same
	// All of these should be exactly the same object in memory, no copies
	expect(getManyResultInitial).toBe(getManyResultCache);
	expect(getOneResultInitial).toBe(getOneResultCache);
	expect(getManyResultInitial[0]).toBe(getOneResultInitial);
	expect(getManyResultInitial[0]).toBe(getOneResultCache);
	expect(getManyResultCache[0]).toBe(getOneResultCache);
	expect(getManyResultCache[0]).toBe(getOneResultInitial);
});
