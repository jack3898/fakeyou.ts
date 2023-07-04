import { constants, request } from '../../util/index.js';
import ProfileUser from '../profileUser/ProfileUser.js';
import Subscription from '../subscription/Subscription.js';
import { type SessionUserSchema, loggedInUserProfileResponseSchema } from './sessionUser.schema.js';

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

	readonly token: string;
	readonly username: string;
	readonly displayName: string;
	readonly emailGravatarHash: string;
	readonly fakeyouPlan: string;
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

	static async fetchLoggedInUser(): Promise<SessionUser | null> {
		const response = await request.send(new URL(`${constants.API_URL}/session`));
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
