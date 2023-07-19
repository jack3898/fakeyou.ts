import { type z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginSchema = fakeyouResponse;
