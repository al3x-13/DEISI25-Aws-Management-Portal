import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
	id: z.number().openapi({
		example: 1337
	}),
	username: z.string().openapi({
		example: 'j0hn.w3ak'
	}),
	email: z.string().openapi({
		example: 'j0hn.w3ak@example.com'
	}),
	role: z.string().openapi({
		example: 'user'
	}),
	createdAt: z.string().datetime().openapi({
		example: '2024-06-19T00:00:00Z'
	})
});

export type UserNoHash = z.infer<typeof UserSchema>;
