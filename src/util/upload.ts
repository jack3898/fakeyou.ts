import * as request from './request.js';
import crypto from 'node:crypto';

export async function wav(url: URL, data: Buffer): Promise<Response> {
	const headers = new Headers();
	const formData = new FormData();
	const blob = new Blob([data], { type: 'audio/wav' });

	formData.append('file', blob);
	formData.append('uuid_idempotency_token', crypto.randomUUID());

	const result = await request.send(url, {
		method: 'POST',
		headers,
		body: formData
	});

	return result;
}
