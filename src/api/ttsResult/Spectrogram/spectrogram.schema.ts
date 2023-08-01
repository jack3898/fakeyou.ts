import { z } from 'zod';

export type MelMatrix = z.infer<typeof melMatrix>;

export const melMatrix = z.array(z.array(z.number().min(0).max(255)));
