import { implFetchUser } from '../../implementation/User.js';
import { Client, type User } from '../../index.js';
import { CommentSchema } from './comment.schema.js';

/**
 * A comment on a user profile.
 */
export class Comment implements User {
	constructor(client: Client, data: CommentSchema) {
		this.client = client;

		this.token = data.token;
		this.userToken = data.user_token;
		this.username = data.username;
		this.userDisplayName = data.user_display_name;
		this.userGravatarHash = data.user_gravatar_hash;
		this.defaultAvatarIndex = data.default_avatar_index;
		this.defaultAvatarColorIndex = data.default_avatar_color_index;
		this.commentMarkdown = data.comment_markdown;
		this.commentRenderedHtml = data.comment_rendered_html;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
		this.maybeEditedAt = data.maybe_edited_at;
	}

	readonly client: Client;

	/**
	 * The token of the comment. This is NOT the author's user token.
	 */
	readonly token: string;
	/**
	 * The token of the user who left the comment.
	 */
	readonly userToken: string;
	/**
	 * The username of the user who left the comment.
	 */
	readonly username: string;
	/**
	 * The display name of the user who left the comment.
	 */
	readonly userDisplayName: string;
	readonly userGravatarHash: string;
	readonly defaultAvatarIndex: number;
	readonly defaultAvatarColorIndex: number;
	readonly commentMarkdown: string;
	readonly commentRenderedHtml: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly maybeEditedAt: Date | null;

	/**
	 * Fetch the user profile of the user who left the comment.
	 */
	fetchProfile = implFetchUser;
}
