import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const testContract = c.router(
	{
		default: {
			method: 'GET',
			path: '/',
			responses: {
				200: z.string(),
			},
			summary: 'Default test endpoint'
		},
		test: {
			method: 'GET',
			path: '/test',
			responses: {
				200: z.object({
					test: z.string(),
				}),
			},
		},
	},
);

export { testContract };
