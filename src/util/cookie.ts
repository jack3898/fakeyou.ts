export function extractCookieFromHeaders(headers: Headers): string | undefined {
	return headers
		.get('set-cookie')
		?.match(/=([^;]+)/)
		?.at(1);
}
