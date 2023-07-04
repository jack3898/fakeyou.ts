import * as log from './log.js';

let cookie: string | undefined;

/**
 * Light wrapper over fetch, pre-applies headers useful to this package.
 */
export async function send(url: URL, request?: RequestInit): Promise<Response> {
	log.http(url);

	const headers = new Headers();

	headers.append('accept', 'application/json');
	headers.append('content-type', 'application/json');
	headers.append('credentials', 'include');

	if (cookie) {
		headers.append('cookie', `session=${cookie}`);
	}

	return fetch(url, {
		headers,
		...request
	});
}

export function setCookie(newCookie?: string): void {
	cookie = newCookie;
}

export function isAuthenticated(): boolean {
	return !!cookie;
}
