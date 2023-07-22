import FakeYouError from '../../error/FakeYouError.js';
import { constants, log, prettyParse } from '../../util/index.js';
import Badge from '../badge/Badge.js';
import type TtsModel from '../ttsModel/TtsModel.js';
import UserAudioFile from './userAudioFile/UserAudioFile.js';
import {
	editUserProfileInputSchema,
	editUserProfileResponseSchema,
	type EditUserProfileInputSchema,
	type UserProfileSchema
} from './profileUser.schema.js';
import Client from '../../index.js';
import { userTtsListResponseSchema } from './userAudioFile/userAudioFile.schema.js';

type PaginatedUserAudioFiles = {
	cursorNext: string | null;
	cursorPrev: string | null;
	results: UserAudioFile[];
};

export default class ProfileUser {
	constructor(data: UserProfileSchema, client: Client) {
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

		this.#client = client;
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

	readonly #client: Client;

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

			const result = await this.#client.rest.send(new URL(`${constants.API_URL}/user/${this.username}/edit_profile`), {
				method: 'POST',
				body: JSON.stringify(body)
			});

			const json = prettyParse(editUserProfileResponseSchema, await result.json());

			return json.success;
		} catch (error) {
			log.error(`Response from API failed validation. Do you have the right privileges to edit this user?\n${error}`);

			return false;
		}
	}

	/**
	 * Fetch a user audio file by its token.
	 *
	 * @param cursor The cursor to use for pagination. If not provided, the first page will be fetched.
	 * @returns The user audio file. Undefined if the audio file could not be fetched.
	 */
	async fetchUserAudioFiles(cursor?: string): Promise<PaginatedUserAudioFiles | undefined> {
		const url = new URL(`${constants.API_URL}/user/${this.username}/tts_results?limit=10`);

		if (cursor) {
			url.searchParams.append('cursor', cursor);
		}

		try {
			const response = await this.#client.rest.send(url);
			const json = prettyParse(userTtsListResponseSchema, await response.json());
			const results = json.results.map((userTtsAudioEntry) => new UserAudioFile(userTtsAudioEntry));

			return {
				cursorNext: json.cursor_next,
				cursorPrev: json.cursor_previous,
				results
			};
		} catch (error) {
			log.error(`Response from API failed validation. Could not load user TTS results.\n${error}`);
		}
	}

	/**
	 * Fetchg the TTS models of the user profile. These are the models that the user has uploaded.
	 *
	 * @returns The TTS models of the user profile. The array will be empty if the user has not uploaded any models.
	 * @throws {FakeYouError} Fetch of user profile models failed.
	 */
	async fetchUserModels(): Promise<Map<string, TtsModel>> {
		const userModels = await this.#client.fetchTtsModelsByUser(this.username);

		if (userModels) {
			return userModels;
		}

		throw new FakeYouError('Fetch of user profile models failed.');
	}
}
