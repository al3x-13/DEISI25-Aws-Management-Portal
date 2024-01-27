import { z } from "zod";

export const ApiErrorSchema = z.object({
	type: z.string(),
	message: z.string().optional(),
	hint: z.string().optional(),
});

/**
 * Represent API authentication error.
 */
export type ApiError = z.infer<typeof ApiErrorSchema>;
