import { expect, it, vi } from 'vitest';
import Client from '../../services/client/Client.js';
import ProfileUser from '../profileUser/ProfileUser.js';
import Subscription from '../subscription/Subscription.js';
import SessionUser from './SessionUser.js';

const client = new Client();

// Requires a valid session token to be set in the environment
// Please see CONTRIBUTING.md for more information

it('should fetch session user', async () => {
	const user = await client.fetchLoggedInUser();

	expect(user).toBeInstanceOf(SessionUser);
});

it("should fetch user's profile", async () => {
	const user = await client.fetchLoggedInUser();
	const profile = await user?.fetchProfile();

	expect(profile).toBeInstanceOf(ProfileUser);
});

it("should fetch a the session user's profile subscription", async () => {
	const user = await client.fetchLoggedInUser();
	const subscription = await user?.fetchSubscription();

	expect(subscription).toBeInstanceOf(Subscription);
});

it('should return undefined if no user is logged in', async () => {
	vi.stubEnv('FAKEYOU_COOKIE', 'invalid cookie');

	const loggedOutClient = new Client(); // Refresh login

	const user = await loggedOutClient.fetchLoggedInUser();

	expect(user).toBeUndefined();

	vi.unstubAllEnvs();
});
