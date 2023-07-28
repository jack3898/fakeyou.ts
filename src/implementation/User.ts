import type { ProfileUser } from '../api/profileUser/ProfileUser.js';
import { type BaseClass } from '../implementation/index.js';

/**
 * An implementation to fetch user related data.
 */
export interface User extends BaseClass {
	/**
	 * The username of the user.
	 */
	username: string;

	fetchProfile(): Promise<ProfileUser | undefined>;
}

/**
 * Fetch the profile of the user.
 *
 * @param this The class that implements this {@link User} interface.
 * @returns The profile of the user.
 */
export function implFetchUser(this: User): Promise<ProfileUser | undefined> {
	return this.client.fetchUserProfile(this.username);
}
