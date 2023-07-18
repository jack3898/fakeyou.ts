import FakeYouError from '../../error/FakeYouError.js';
import type Client from '../../index.js';
import { cache, constants, log, prettyParse } from '../../util/index.js';
import Badge from '../badge/Badge.js';
import TtsModel from '../ttsModel/TtsModel.js';
import UserAudioFile from '../userAudioFile/UserAudioFile.js';
import {
	editUserProfileInputSchema,
	editUserProfileResponseSchema,
	userProfileResponseSchema,
	type EditUserProfileInputSchema,
	type UserProfileSchema
} from './profileUser.schema.js';

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

	readonly token: string;
	readonly username: string;
	readonly displayName: string;
	readonly emailGravatarHash: string;
	readonly defaultAvatarIndex: number;
	readonly defaultAvatarColorIndex: number;
	readonly bio: string;
	readonly bioHtml: string;
	readonly userRoleSlug: string;
	readonly disableGravatar: boolean;
	readonly preferredTtsResultVisibility: string;
	readonly preferredW2lResultVisibility: string;
	readonly discordUsername: string | null;
	readonly twitchUsername: string | null;
	readonly twitterUsername: string | null;
	readonly patreonUsername: string | null;
	readonly githubUsername: string | null;
	readonly cashappUsername: string | null;
	readonly websiteUrl: string | null;
	readonly createdAt: Date;
	readonly moderatorFields: string | null;
	readonly badges: Badge[];

	static client: Client;

	static async fetchUserProfile(username: string): Promise<ProfileUser | undefined> {
		try {
			const json = await cache.wrap('fetch-user-profile', async () => {
				const response = await this.client.rest.send(new URL(`${constants.API_URL}/user/${username}/profile`));

				return prettyParse(userProfileResponseSchema, await response.json());
			});

			return new this(json.user);
		} catch (error) {
			log.error(
				`Response from API failed validation. Check the username you provided, it can be different to their display name.\n${error}`
			);
		}
	}

	/**
	 * Edit the user profile.
	 *
	 * If you do not have privileges to edit other users' accounts, this will return false
	 */
	async editProfile(newValues: Partial<EditUserProfileInputSchema>): Promise<boolean> {
		try {
			const body = prettyParse(editUserProfileInputSchema, {
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

			const result = await ProfileUser.client.rest.send(
				new URL(`${constants.API_URL}/user/${this.username}/edit_profile`),
				{ method: 'POST', body: JSON.stringify(body) }
			);

			const json = prettyParse(editUserProfileResponseSchema, await result.json());

			return json.success;
		} catch (error) {
			log.error(`Response from API failed validation. Do you have the right privileges to edit this user?\n${error}`);

			return false;
		}
	}

	fetchTtsAudioHistory(cursor?: string): Promise<
		| {
				cursorNext: string | null;
				cursorPrev: string | null;
				results: UserAudioFile[];
		  }
		| undefined
	> {
		return UserAudioFile.fetchUserAudioFiles(this.username, cursor);
	}

	async fetchUserModels(): Promise<TtsModel[]> {
		const userModels = await TtsModel.fetchModelsByUser(this.username);

		if (userModels) {
			return userModels;
		}

		throw new FakeYouError('Fetch of user profile models failed.');
	}
}
