export default class Rest {
	static #cookie?: string;

	/**
	 * Light wrapper over fetch, pre-applies headers useful to this package.
	 */
	static fetch(url: URL, request: Omit<RequestInit, 'headers'>) {
		const headers = new Headers();

		headers.append('accept', 'application/json');
		headers.append('content-type', 'application/json');
		headers.append('credentials', 'include');

		if (this.#cookie) {
			headers.append('cookie', `session=${this.#cookie}`);
		}

		return fetch(url, {
			headers,
			...request
		});
	}

	static set cookie(cookie: string | undefined) {
		this.#cookie = cookie;
	}
}
