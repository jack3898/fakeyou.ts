import { expect, it } from 'vitest';
import { mapify } from './map.js';

it('should convert to map', () => {
	const map = mapify('id', [
		{ id: 'foo', value: 'bar' },
		{ id: 'bar', value: 'baz' }
	]);

	expect(map.get('foo')).toEqual({ id: 'foo', value: 'bar' });
	expect(map.get('bar')).toEqual({ id: 'bar', value: 'baz' });
});

it('should convert to map with duplicate keys', () => {
	const map = mapify('id', [
		{ id: 'foo', value: 'bar' },
		{ id: 'foo', value: 'baz' }
	]);

	expect(map.get('foo')).toEqual({ id: 'foo', value: 'baz' });
});

it('should convert to map with no keys', () => {
	const map = mapify('id', []);

	expect(map.size).toBe(0);
});

it('should convert to map with no key', () => {
	const map = mapify('id' as 'value', [{ value: 'bar' }]);

	expect(map.size).toBe(0);
});

it('should map keys of different types', () => {
	const map = mapify('id', [
		{ id: 'foo', value: 'bar' },
		{ id: 123, value: 'baz' }
	]);

	expect(map.get('foo')).toEqual({ id: 'foo', value: 'bar' });
	expect(map.get(123)).toEqual({ id: 123, value: 'baz' });
});

it('should ignore null keys', () => {
	const map = mapify('id', [
		{ id: null, value: 'bar' },
		{ id: 'foo', value: 'baz' }
	]);

	expect(map.size).toBe(1);
	expect(map.get('foo')).toEqual({ id: 'foo', value: 'baz' });
});

it('should ignore undefined keys', () => {
	const map = mapify('id', [
		{ id: undefined, value: 'bar' },
		{ id: 'foo', value: 'baz' }
	]);

	expect(map.size).toBe(1);
	expect(map.get('foo')).toEqual({ id: 'foo', value: 'baz' });
});
