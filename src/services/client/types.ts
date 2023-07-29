/**
 * The key to used to identify the cached data. These are the keys the client instance will use.
 */
export type CacheKey =
	| 'login'
	| 'fetch-category-model-relationships'
	| 'fetch-categories'
	| `fetch-category-models-token-${string}`
	| 'fetch-root-categories'
	| `fetch-category-token-${string}` // string = category token
	| `fetch-user-profile-${string}` // string = user username
	| `fetch-user-comments-${string}` // string = user username
	| 'fetch-subscription'
	| 'fetch-leaderboard'
	| 'fetch-queue'
	| 'fetch-v2v-models'
	| `fetch-v2v-models-name-${string}` // string = model name
	| `fetch-v2v-models-user-${string}` // string = user username
	| `fetch-v2v-models-token-${string}` // string = model token
	| 'fetch-tts-models'
	| `fetch-tts-models-name-${string}` // string = model search substring
	| `fetch-tts-model-token-${string}` // string = model token
	| `fetch-tts-models-user-${string}` // string = user username
	| `fetch-tts-parent-categories-${string}`
	| `fetch-tts-result-token-${string}`; // string = tts result token;

export type ClientOptions = {
	/**
	 * Whether to enable logging. This is useful for debugging or seeing what the library is doing.
	 */
	logging?: boolean;
};
