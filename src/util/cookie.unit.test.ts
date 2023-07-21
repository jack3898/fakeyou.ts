import { extractCookieFromHeaders } from './cookie.js';
import { it, expect } from 'vitest';

it('get be undefined with no set-cookie ', () => {
	const headers = new Headers();
	const cookie = extractCookieFromHeaders(headers);

	expect(cookie).toBeUndefined();
});

it('should get cookie with no attributes', () => {
	const headers = new Headers();

	headers.set('set-cookie', 'foo=bar');

	const cookie = extractCookieFromHeaders(headers);

	expect(cookie).toBe('bar');
});

it('should get cookie with attributes', () => {
	const headers = new Headers();

	headers.set('set-cookie', 'foo=bar; Path=/; HttpOnly; Secure');

	const cookie = extractCookieFromHeaders(headers);

	expect(cookie).toBe('bar');
});
