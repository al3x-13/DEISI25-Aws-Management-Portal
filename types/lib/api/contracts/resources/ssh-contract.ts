import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { SSHKeyAccessType, SSHKeyPairType, SSHKeySchema, SSHPrivateKeyFileFormat } from "../../../resources/ssh/ssh";
import { ApiErrorSchema } from "../../types/error";

extendZodWithOpenApi(z);

const c = initContract();

const sshContract = c.router({
	create: {
		method: 'POST',
		path: '/create',
		body: z.object({
			name: z.string().openapi({
				example: 'webserver-ssh-key'
			}),
			keyPairType: z.nativeEnum(SSHKeyPairType).openapi({
				example: SSHKeyPairType.RSA
			}),
			privateKeyFileFormat: z.nativeEnum(SSHPrivateKeyFileFormat).openapi({
				example: SSHPrivateKeyFileFormat.PEM
			}),
			keyAccessType: z.nativeEnum(SSHKeyAccessType).openapi({
				example: SSHKeyAccessType.Private
			}),
		}),
		responses: {
			201: z.object({
				sshKey: SSHKeySchema,
			}),
			400: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Create SSH key',
		description: 'Creates a new AWS SSH key. Returns the newly created SSH key if the request succeds.'
	},
	delete: {
		method: 'POST',
		path: '/delete',
		body: z.object({
			keyName: z.string().openapi({
				example: 'webserver-ssh-key'
			})
		}),
		responses: {
			200: z.object({
				success: z.boolean()
			}),
			400: ApiErrorSchema,
			401: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Delete SSH key',
		description: 'Deletes an existing AWS SSH key.'
	},
	updateAccessType: {
		method: 'POST',
		path: '/updateAccessType',
		body: z.object({
			keyName: z.string().openapi({
				example: 'webserver-ssh-key'
			}),
			keyAccessType: z.nativeEnum(SSHKeyAccessType).openapi({
				example: SSHKeyAccessType.Public
			})
		}),
		responses: {
			201: z.object({
				success: z.boolean()
			}),
			400: ApiErrorSchema,
			401: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'Update access type of SSH key',
		description: 'Updates the access type of an existing AWS SSH key.'
	},
	listKeys: {
		method: 'GET',
		path: '/listKeys',
		query: z.object({
			maxResults: z.number().optional().openapi({
				example: 30
			})
		}),
		responses: {
			200: z.object({
				sshKeys: z.array(SSHKeySchema),
			}),
			400: ApiErrorSchema,
			401: ApiErrorSchema,
			500: ApiErrorSchema
		},
		summary: 'List all the existing SSH keys.',
		description: 'Lists all the existing AWS SSH keys available to the requesting user.'
	},
	checkNameAvailability: {
		method: 'POST',
		path: '/checkNameAvailability',
		body: z.object({
			keyName: z.string().openapi({
				example: 'test-key'
			})
		}),
		responses: {
			200: z.object({
				available: z.boolean().openapi({
					example: true
				})
			}),
			400: ApiErrorSchema,
			404: ApiErrorSchema,
			500: ApiErrorSchema,
		},
		summary: 'Check SSH Key name availability',
		description: 'Checks if the given key name is available (i.e. not taken).'
	}
},{
	pathPrefix: '/compute/ssh'
});

export { sshContract };
