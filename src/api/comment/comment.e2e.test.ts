import { it, expect } from 'vitest';
import { Client } from '../../index.js';
import { Comment } from './Comment.js';

const client = new Client();

it('should fetch comments', async () => {
	const profile = await client.fetchUserProfile('vegito1089');
	const profileComments = await profile?.fetchUserComments();

	expect(profileComments).toBeDefined();

	for (const comment of profileComments!) {
		expect(comment).toBeInstanceOf(Comment);
	}
});
