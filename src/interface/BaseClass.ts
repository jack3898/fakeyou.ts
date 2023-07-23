import type Client from '../services/client/Client.js';

/**
 * Ensure that all classes that extend this interface have a client property.
 * The client has essential methods for making requests to the API and other services.
 */
export interface BaseClass {
	readonly client: Client;
}
