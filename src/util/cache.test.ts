import { it, vitest, expect, afterEach } from 'vitest';
import { cache } from './index.js';

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
