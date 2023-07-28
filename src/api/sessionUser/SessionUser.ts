import { implFetchUser, type User } from '../../implementation/index.js';
import Client from '../../index.js';
import { constants, log, prettyParse } from '../../util/index.js';
import { Subscription } from '../subscription/Subscription.js';
import { activeSubscriptionsResponseSchema } from '../subscription/subscription.schema.js';
import { type SessionUserSchema } from './sessionUser.schema.js';

/**
 * The user who is logged in to this client. This is the user that is used to make authenticated requests to the FakeYou API.
 */
export class SessionUser implements User {
	/**
	 * @param client The main client.
	 * @param data The raw session user data from the FakeYou API.
	 */
	constructor(client: Client, data: SessionUserSchema) {
		this.client = client;

		this.token = data.user_token;
		this.username = data.username;
		this.displayName = data.display_name;
		this.emailGravatarHash = data.email_gravatar_hash;
		this.storytellerStreamPlan = data.storyteller_stream_plan;
		this.canUseTts = data.can_use_tts;
		this.canUseW2l = data.can_use_w2l;
		this.canDeleteOwnTtsResults = data.can_delete_own_tts_results;
		this.canDeleteOwnW2lResults = data.can_delete_own_w2l_results;
		this.canDeleteOwnAccount = data.can_delete_own_account;
		this.canUploadTtsModels = data.can_upload_tts_models;
		this.canUploadW2lTemplates = data.can_upload_w2l_templates;
		this.canDeleteOwnTtsModels = data.can_delete_own_tts_models;
		this.canDeleteOwnW2lTemplates = data.can_delete_own_w2l_templates;
		this.canApproveW2lTemplates = data.can_approve_w2l_templates;
		this.canEditOtherUsersProfiles = data.can_edit_other_users_profiles;
		this.canEditOtherUsersTtsModels = data.can_edit_other_users_tts_models;
		this.canEditOtherUsersW2lTemplates = data.can_edit_other_users_w2l_templates;
		this.canDeleteOtherUsersTtsModels = data.can_delete_other_users_tts_models;
		this.canDeleteOtherUsersTtsResults = data.can_delete_other_users_tts_results;
		this.canDeleteOtherUsersW2lTemplates = data.can_delete_other_users_w2l_templates;
		this.canDeleteOtherUsersW2lResults = data.can_delete_other_users_w2l_results;
		this.canBanUsers = data.can_ban_users;
		this.canDeleteUsers = data.can_delete_users;
	}

	readonly client: Client;

	readonly token: string;
	readonly username: string;
	readonly displayName: string;
	readonly emailGravatarHash: string;
	readonly storytellerStreamPlan: string;
	readonly canUseTts: boolean;
	readonly canUseW2l: boolean;
	readonly canDeleteOwnTtsResults: boolean;
	readonly canDeleteOwnW2lResults: boolean;
	readonly canDeleteOwnAccount: boolean;
	readonly canUploadTtsModels: boolean;
	readonly canUploadW2lTemplates: boolean;
	readonly canDeleteOwnTtsModels: boolean;
	readonly canDeleteOwnW2lTemplates: boolean;
	readonly canApproveW2lTemplates: boolean;
	readonly canEditOtherUsersProfiles: boolean;
	readonly canEditOtherUsersTtsModels: boolean;
	readonly canEditOtherUsersW2lTemplates: boolean;
	readonly canDeleteOtherUsersTtsModels: boolean;
	readonly canDeleteOtherUsersTtsResults: boolean;
	readonly canDeleteOtherUsersW2lTemplates: boolean;
	readonly canDeleteOtherUsersW2lResults: boolean;
	readonly canBanUsers: boolean;
	readonly canDeleteUsers: boolean;

	/**
	 * Fetch the profile of the currently logged in user which contains more information than the session user.
	 *
	 * @returns The profile of the currently logged in user. Undefined if no user is logged in.
	 */
	fetchProfile = implFetchUser;

	/**
	 * Fetch the subscription of the currently logged in user.
	 *
	 * @returns The subscription of the currently logged in user. Undefined if no user is logged in.
	 */
	async fetchSubscription(): Promise<Subscription | undefined> {
		try {
			const response = await this.client.rest.send(`${constants.API_URL}/v1/billing/active_subscriptions`);
			const json = prettyParse(activeSubscriptionsResponseSchema, await response.json());

			return new Subscription(json);
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);
		}
	}
}
