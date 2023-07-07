import * as request from './request.js';

export async function wav(url: URL): Promise<Buffer | undefined> {
	const headers = new Headers();

	headers.append('content-type', 'audio/x-wav');

	const result = await request.send(url, {
		method: 'GET',
		headers
	});

	if (result.type === 'opaque') {
		return;
	}

	const arrayBuffer = await result.blob().then((b) => b?.arrayBuffer());

	return Buffer.from(arrayBuffer);
}
