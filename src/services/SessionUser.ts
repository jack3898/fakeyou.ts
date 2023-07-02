import { apiUrl } from '../util/constants.js';
import { request } from '../util/request.js';
import { loggedInUserProfileResponseSchema, type SessionUserSchema } from '../util/validation.js';
import ProfileUser from './ProfileUser.js';
import Subscription from './Subscription.js';

export default class SessionUser {
	constructor(data: SessionUserSchema) {
		this.token = data.user_token;
		this.username = data.username;
		this.displayName = data.display_name;
		this.emailGravatarHash = data.email_gravatar_hash;
		this.fakeyouPlan = data.fakeyou_plan;
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

	token: string;

	username: string;

	displayName: string;

	emailGravatarHash: string;

	fakeyouPlan: string;

	storytellerStreamPlan: string;

	canUseTts: boolean;

	canUseW2l: boolean;

	canDeleteOwnTtsResults: boolean;

	canDeleteOwnW2lResults: boolean;

	canDeleteOwnAccount: boolean;

	canUploadTtsModels: boolean;

	canUploadW2lTemplates: boolean;

	canDeleteOwnTtsModels: boolean;

	canDeleteOwnW2lTemplates: boolean;

	canApproveW2lTemplates: boolean;

	canEditOtherUsersProfiles: boolean;

	canEditOtherUsersTtsModels: boolean;

	canEditOtherUsersW2lTemplates: boolean;

	canDeleteOtherUsersTtsModels: boolean;

	canDeleteOtherUsersTtsResults: boolean;

	canDeleteOtherUsersW2lTemplates: boolean;

	canDeleteOtherUsersW2lResults: boolean;

	canBanUsers: boolean;

	canDeleteUsers: boolean;

	static async fetchLoggedInUser(): Promise<SessionUser | null> {
		const response = await request(new URL(`${apiUrl}/session`));
		const loggedInUser = loggedInUserProfileResponseSchema.parse(await response.json());

		if (loggedInUser.logged_in) {
			return new this(loggedInUser.user);
		}

		return null;
	}

	readonly fetchSubscriptions = Subscription.fetchSubscriptions;

	fetchProfile(): Promise<ProfileUser | null> {
		return ProfileUser.fetchUserProfile(this.username);
	}
}
