import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		setupFiles: ['dotenv/config'],
		testTimeout: process.env.E2E ? 20_000 : 5000
	}
});
