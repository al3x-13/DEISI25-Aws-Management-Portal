import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ApiErrorSchema } from "../types/error";
import { SchemaID, apiSchemas } from "../schemas/response-objects";
import { UserSchema } from "../../users/users";

const c = initContract();

const userContract = c.router(
	{
		info: {
			method: 'GET',
			path: '/info',
			responses: {
				200: apiSchemas[SchemaID.UserInfo],
				401: ApiErrorSchema,
			},
			summary: 'Get user info',
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
		},
		listAllUsers: {
			method: 'GET',
			path: '/listUsers',
			responses: {
				200: z.object({
					users: z.array(UserSchema)
				}),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			}
		},
		delete: {
			method: 'POST',
			path: '/delete',
			body: z.object({
				id: z.number().openapi({
					example: 1337
				})
			}),
			responses: {
				200: z.object({
					success: z.boolean()
				}),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			}
		}
	},
	{
		pathPrefix: '/user'
	}
);

export { userContract };
