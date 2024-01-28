import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ApiErrorSchema } from "../types/error";

const c = initContract();

const userContract = c.router(
	{
		info: {
			method: 'GET',
			path: '/info',
			responses: {
				200: z.object({
					id: z.number(),
					username: z.string(),
					role: z.string(),
				}),
				401: ApiErrorSchema,
			},
			summary: 'Get user info'
		},
		id: {
			method: 'GET',
			path: '/id',
			responses: {
				200: z.object({
					id: z.number(),
				}),
				401: ApiErrorSchema
			},
			summary: 'Get user id'
		},
		username: {
			method: 'GET',
			path: '/username',
			responses: {
				200: z.object({
					username: z.string(),
				}),
				401: ApiErrorSchema
			},
			summary: 'Get user username'
		},
		role: {
			method: 'GET',
			path: '/role',
			responses: {
				200: z.object({
					role: z.string(),
				}),
				401: ApiErrorSchema
			},
			summary: 'Get user role'
		},
		validate: {
			method: 'GET',
			path: '/validate',
			responses: {
				200: z.object({
					valid: z.boolean(),
				}),
				401: ApiErrorSchema
			},
			summary: 'Validate user JWT'
		}
	},
	{
		pathPrefix: '/user'
	}
);

export { userContract };
