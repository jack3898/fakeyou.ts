import { expect, it } from 'vitest';
import { decode, encode } from './base64.js';

it('should encode to base64', () => {
	expect(encode('Hey!')).toBe('SGV5IQ==');
});

it('should decode from base64', () => {
	expect(decode('SGV5IQ==')).toBe('Hey!');
});
