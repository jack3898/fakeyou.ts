import { z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type CredentialsSchema = z.infer<typeof credentialsSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export const credentialsSchema = z.object({
	username: z.string(),
	password: z.string()
});

export const loginSchema = fakeyouResponse;
