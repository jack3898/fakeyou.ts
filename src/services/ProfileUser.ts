import { cache } from '../util/cache.js';
import { apiUrl } from '../util/constants.js';
import { request } from '../util/request.js';
import { userProfileResponseSchema, type UserProfileSchema } from '../util/validation.js';
import Badge from './Badge.js';

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

	static async fetchUserProfile(username: string) {
		const json = await cache('fetch-user-profile', async () => {
			const response = await request(new URL(`${apiUrl}/user/${username}/profile`), { method: 'GET' });
			return userProfileResponseSchema.parse(await response.json());
		});

		return new this(json.user);
	}
}
