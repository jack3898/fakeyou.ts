import { z } from 'zod';

export type CredentialsSchema = z.infer<typeof credentialsSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export const credentialsSchema = z.object({
	username: z.string(),
	password: z.string()
});

export const loginSchema = z.object({
	success: z.boolean()
});
