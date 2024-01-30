import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ApiErrorSchema } from "../types/error";

const c = initContract();

const authContract = c.router(
	{
		authenticate: {
			method: 'POST',
			path: '/authenticate',
			responses: {
				200: z.object({
					token: z.string(),
				}),
				401: ApiErrorSchema,
			},
			body: z.object({
				username: z.string(),
				password: z.string(),
			}),
			summary: 'Authenticate user'
		},
	},
	{
		pathPrefix: '/auth',
	},
);

export { authContract };
