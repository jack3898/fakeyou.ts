import { log } from '../../util/index.js';

export class Rest {
	#cookie?: string = process.env.FAKEYOU_COOKIE;

	/**
	 * Light wrapper over fetch. Pre-applies headers useful to this package.
	 *
	 * Note: If `FAKEYOU_COOKIE` environment variable is set, it will be used for authentication.
	 *
	 * @param url The URL to send the request to.
	 * @param request The request options to send.
	 */
	send(url: URL, request?: RequestInit): Promise<Response> {
		log.http(url);

		const headers = new Headers();

		headers.append('accept', 'application/json');
		headers.append('content-type', 'application/json');

		// Must be included because the API uses cookies for authentication
		// and the browser will not send cookies to a cross-origin URL unless
		// credentials are included.
		headers.append('credentials', 'include');

		if (this.#cookie) {
			headers.append('cookie', `session=${this.#cookie}`);
		}

		return fetch(url, {
			headers,
			...request
		});
	}

	/**
	 * Download a file from the given URL.
	 *
	 * @param url The URL to download from.
	 * @param mime The mime type of the file.
	 */
	async download(url: URL, mime: string): Promise<Buffer | undefined> {
		const headers = new Headers();

		headers.append('content-type', mime);

		const result = await this.send(url, {
			method: 'GET',
			headers
		});

		// If the response is opaque, it means that the request was made to a
		// cross-origin resource without CORS, which means that the response
		// cannot be read.
		if (result.type === 'opaque') {
			return;
		}

		const blob = await result.blob();

		// If blob size is 0, it means that the file does not exist
		if (blob.size === 0) {
			return;
		}

		const arrayBuffer = await blob.arrayBuffer();

		return Buffer.from(arrayBuffer);
	}

	/**
	 * Upload a file to the given URL.
	 *
	 * @param url The URL to upload to.
	 * @param data The data to upload as a buffer.
	 * @param mime The mime type of the file.
	 * @returns The response from the server.
	 */
	async upload(url: URL, data: Buffer, mime: string): Promise<Response> {
		const headers = new Headers();
		const formData = new FormData();
		const blob = new Blob([data], { type: mime });

		formData.append('file', blob);
		formData.append('uuid_idempotency_token', crypto.randomUUID());

		const result = await this.send(url, {
			method: 'POST',
			headers,
			body: formData
		});

		return result;
	}

	/**
	 * Set the cookie to use for authentication.
	 */
	set cookie(cookie: string | undefined) {
		this.#cookie = cookie;
	}

	/**
	 * Authentication status.
	 *
	 * @returns Whether or not the user is authenticated.
	 */
	get isAuthenticated(): boolean {
		return !!this.#cookie;
	}
}

export const rest = new Rest();
