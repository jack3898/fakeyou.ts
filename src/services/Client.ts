import { requiredLogin, type RequiredLogin, loginResponse } from '../util/validation.js';
import { apiUrl } from '../util/constants.js';
import AuthorisationError from '../classes/AuthorisationError.js';
import Model from './Model.js';

export default class Client {
	static #cookie?: string;

	model = Model;

	/**
	 * Login in with your provided credentials to take advantage of any potential premium benefits.
	 */
	async login(credentials: RequiredLogin): Promise<void> {
		const validatedCredentials = requiredLogin.parse(credentials);

		const response = await Client.fetch(new URL(`${apiUrl}/login`), {
			method: 'POST',
			body: JSON.stringify({
				username_or_email: validatedCredentials.username,
				password: validatedCredentials.password
			})
		});

		const body = loginResponse.parse(await response.json());

		if (!body.success) {
			throw new AuthorisationError(`Authentication failed. Status ${response.status}.`);
		}

		Client.#cookie = response.headers
			.get('set-cookie')
			?.match(/^\w+.=([^;]+)/)
			?.at(1);
	}

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

	static get authenticated() {
		return !!this.#cookie;
	}
}
