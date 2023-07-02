import FakeYouError from '../error/FakeYouError.js';
import { cache } from '../util/cache.js';
import { apiUrl } from '../util/constants.js';
import { log } from '../util/log.js';
import { request } from '../util/request.js';
import {
	editUserProfileInputSchema,
	editUserProfileResponseSchema,
	userProfileResponseSchema,
	type EditUserProfileInputSchema,
	type UserProfileSchema
} from '../util/validation.js';
import Badge from './Badge.js';
import Model from './Model.js';
import UserAudioFile from './UserAudioFile.js';

export default class ProfileUser {
	constructor(data: UserProfileSchema) {
		this.token = data.user_token;
		this.username = data.username;
		this.displayName = data.display_name;
		this.emailGravatarHash = data.email_gravatar_hash;
		this.defaultAvatarIndex = data.default_avatar_index;
		this.defaultAvatarColorIndex = data.default_avatar_color_index;
		this.bio = data.profile_markdown;
		this.bioHtml = data.profile_rendered_html;
		this.userRoleSlug = data.user_role_slug;
		this.disableGravatar = data.disable_gravatar;
		this.preferredTtsResultVisibility = data.preferred_tts_result_visibility;
		this.preferredW2lResultVisibility = data.preferred_w2l_result_visibility;
		this.discordUsername = data.discord_username;
		this.twitchUsername = data.twitch_username;
		this.twitterUsername = data.twitter_username;
		this.patreonUsername = data.patreon_username;
		this.githubUsername = data.github_username;
		this.cashappUsername = data.cashapp_username;
		this.websiteUrl = data.website_url;
		this.createdAt = data.created_at;
		this.moderatorFields = data.maybe_moderator_fields;
		this.badges = data.badges.map((badge) => new Badge(badge));
	}

	token: string;

	username: string;

	displayName: string;

	emailGravatarHash: string;

	defaultAvatarIndex: number;

	defaultAvatarColorIndex: number;

	bio: string;

	bioHtml: string;

	userRoleSlug: string;

	disableGravatar: boolean;

	preferredTtsResultVisibility: string;

	preferredW2lResultVisibility: string;

	discordUsername: string | null;

	twitchUsername: string | null;

	twitterUsername: string | null;

	patreonUsername: string | null;

	githubUsername: string | null;

	cashappUsername: string | null;

	websiteUrl: string | null;

	createdAt: Date;

	moderatorFields: string | null;

	badges: Badge[];

	static async fetchUserProfile(username: string): Promise<ProfileUser | null> {
		try {
			const json = await cache('fetch-user-profile', async () => {
				const response = await request(new URL(`${apiUrl}/user/${username}/profile`), { method: 'GET' });
				return userProfileResponseSchema.parse(await response.json());
			});

			return new this(json.user);
		} catch (error) {
			log.error(
				`Response from API failed validation. Check the username you provided, it can be different to their display name.\n${error}`
			);

			return null;
		}
	}

	/**
	 * Edit the user profile.
	 *
	 * If you do not have privileges to edit other users' accounts, this will return false
	 */
	async editProfile(newValues: Partial<EditUserProfileInputSchema>): Promise<boolean> {
		try {
			const body = editUserProfileInputSchema.parse({
				cashapp_username: this.cashappUsername ?? '',
				discord_username: this.discordUsername ?? '',
				github_username: this.githubUsername ?? '',
				twitch_username: this.twitchUsername ?? '',
				twitter_username: this.twitterUsername ?? '',
				preferred_tts_result_visibility: this.preferredTtsResultVisibility,
				preferred_w2l_result_visibility: this.preferredW2lResultVisibility,
				profile_markdown: this.bio,
				website_url: this.websiteUrl ?? '',
				...newValues
			});

			const result = await request(new URL(`${apiUrl}/user/${this.username}/edit_profile`), {
				method: 'POST',
				body: JSON.stringify(body)
			});

			const json = editUserProfileResponseSchema.parse(await result.json());

			return json.success;
		} catch (error) {
			log.error(`Response from API failed validation. Do you have the right privileges to edit this user?\n${error}`);

			return false;
		}
	}

	fetchTtsAudioHistory(cursor?: string): Promise<{
		cursorNext: string | null;
		cursorPrev: string | null;
		results: UserAudioFile[];
	} | null> {
		return UserAudioFile.fetchUserAudioFiles(this.username, cursor);
	}

	async fetchUserModels(): Promise<Model[]> {
		const userModels = await Model.fetchModelsByUser(this.username);

		if (userModels) {
			return userModels;
		}

		throw new FakeYouError('Fetch of user profile models failed.');
	}
}
