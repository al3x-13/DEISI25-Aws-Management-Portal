import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ApiErrorSchema } from "../types/error";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

const c = initContract();

const authContract = c.router(
	{
		authenticate: {
			method: 'POST',
			path: '/authenticate',
			responses: {
				200: z.object({
					token: z.string(),
				}).openapi({
					title: 'Auth Token',
					description: 'Json Web Token (JWT)'
				}),
				401: ApiErrorSchema.openapi({
					title: 'API Error',
				}),
			},
			body: z.object({
				username: z.string().openapi({
					example: 'john'
				}),
				password: z.string().openapi({
					example: 'p4s$w0rd'
				}),
			}),
			summary: 'Authenticate user',
			description: 'Authenticates a user via credentials (login/password). Returns a JWT (Json Web Token)' + 
				' the user can use to make requests to protected routes (i.e. manage resources).',
		},
	},
	{
		pathPrefix: '/auth',
	},
);

export { authContract };
