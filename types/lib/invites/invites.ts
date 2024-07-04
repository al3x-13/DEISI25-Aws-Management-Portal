import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";


extendZodWithOpenApi(z);

export const UserInviteSchema = z.object({
	uuid: z.string().openapi({
		example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
	}),
	role: z.string().openapi({
		example: 'admin'
	}),
	createdBy: z.string().openapi({
		example: 'j0hn.w3ak'
	}),
	createdAt: z.string().datetime().openapi({
		example: '2024-06-13T00:00:00.000Z'
	}),
	expiresAt: z.string().datetime().openapi({
		example: '2024-06-18T00:00:00.000Z'
	}),
	used: z.boolean().openapi({
		example: false
	}),
	isValid: z.boolean().openapi({
		example: false
	}),
});

export type UserInvite = z.infer<typeof UserInviteSchema>;
