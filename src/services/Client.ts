import { requiredLogin, type RequiredLogin, loginResponse } from '../util/validation.js';
import { apiUrl } from '../util/constants.js';
import AuthorisationError from '../classes/AuthorisationError.js';
import Model from './Model.js';

export default class Client {
	private cookie?: string;
	model = Model;

	/**
	 * Login in with your provided credentials.
	 */
	async login(credentials: RequiredLogin): Promise<string | undefined> {
		const validatedCredentials = requiredLogin.parse(credentials);
		const headers = new Headers();

		headers.append('accept', 'application/json');
		headers.append('content-type', 'application/json');

		const response = await fetch(`${apiUrl}/login`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				username_or_email: validatedCredentials.username,
				password: validatedCredentials.password
			})
		});

		const body = loginResponse.parse(await response.json());

		if (!body.success) {
			throw new AuthorisationError(`Authentication failed. Status ${response.status}.`);
		}

		this.cookie = response.headers
			.get('set-cookie')
			?.match(/^\w+.=([^;]+)/)
			?.at(1);

		return this.cookie;
	}

	get authenticated() {
		return !!this.cookie;
	}
}
