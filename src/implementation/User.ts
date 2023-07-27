import type { ProfileUser } from '../api/profileUser/ProfileUser.js';
import { type BaseClass } from '../interface/index.js';

/**
 * The given class has information about the user.
 * Contractual methods to extend this behavior.
 */
export interface User extends BaseClass {
	username: string;

	fetchProfile(): Promise<ProfileUser | undefined>;
}

/**
 * Implement the {@link User} interface and bind this function to the given class.
 *
 * Fetches the user's profile when the class contains their username.
 */
export function implFetchUser(this: User): Promise<ProfileUser | undefined> {
	return this.client.fetchUserProfile(this.username);
}
