import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { ApiErrorSchema } from "../../types/error";
import { UserInviteSchema } from "../../../invites/invites";

const cUnprotected = initContract();

const inviteContractUnprotected = cUnprotected.router({
	checkValidity: {
		method: 'POST',
		path: '/checkValidity',
		body: z.object({
			uuid: z.string()
		}),
		responses: {
			200: z.object({
				valid: z.boolean()
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Check invite validity'
	},
	submitInvite: {
		method: 'POST',
		path: '/submitInvite',
		body: z.object({
			uuid: z.string(),
			username: z.string(),
			email: z.string(),
			password: z.string()
		}),
		responses: {
			201: z.object({
				success: z.boolean()
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Submit invite form',
		description: 'Submits an invitation form'
	},
},{
	pathPrefix: '/user/invite'
});

const cProtected = initContract();

const inviteContractProtected = cProtected.router({
	createInvite: {
		method: 'POST',
		path: '/createInvite',
		body: z.object({
			role: z.string().openapi({
				example: 'admin'
			}),
			expirationTimestamp: z.string().datetime()
		}),
		responses: {
			201: z.object({
				inviteUUID: z.string()
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Create a user invite',
		description: 'Creates a user invite.'
	},
	deactivateInvite: {
		method: 'POST',
		path: '/deactivateInvite',
		body: z.object({
			uuid: z.string()
		}),
		responses: {
			201: z.object({
				success: z.boolean()
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Deactivate an user invite',
		description: 'Deactivates an user invitation.'
	},
	getAllInvites: {
		method: 'GET',
		path: '/getAllInvites',
		query: z.object({
			maxResults: z.number().optional()
		}),
		responses: {
			200: z.object({
				invites: z.array(UserInviteSchema)
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		}
	}
},{
	pathPrefix: '/user/invite'
});

export { inviteContractUnprotected, inviteContractProtected };
