import { initContract } from "@ts-rest/core";
import { ApiErrorSchema } from "../../types/error";
import { z } from "zod";
import { Ec2InstanceSchema, Ec2State } from "../../../resources/types";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

const c = initContract();

const ec2Contract = c.router(
	{
		create: {
			method: 'POST',
			path: '/create',
			body: z.object({
				name: z.string(),
				instanceType: z.string(),
				ami: z.string(),
				storageType: z.string(),
				storageSizeGiB: z.number(),
			}),
			responses: {
				201: z.object({
					instance: Ec2InstanceSchema
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Create EC2 instance',
			description: 'Creates a new AWS EC2 instance by providing some specifications.' + 
				'Returns the new instance details if the request succeds.'
		},
		terminate: {
			method: 'POST',
			path: '/terminate',
			body: z.object({
				instanceIds: z.array(z.string())
			}),
			responses: {
				201: z.string(),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Terminate EC2 instances',
			description: 'Terminates AWS EC2 instances by providing their Local Resource IDs (LRI).'
		},
		start: {
			method: 'POST',
			path: '/start',
			body: z.object({
				instanceId: z.number().openapi({
					example: 4123
				})
			}),
			responses: {
				201: z.object({
					instanceState: z.nativeEnum(Ec2State).openapi({
						example: Ec2State.PENDING
					})
				}),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Start EC2 instance',
			description: 'Starts an existing EC2 instance by providing its Local Resource ID (LRI).'
		},
		stop: {
			method: 'POST',
			path: '/stop',
			body: z.object({
				instanceId: z.number().openapi({
					example: 4123
				})
			}),
			responses: {
				201: z.object({
					instanceState: z.nativeEnum(Ec2State).openapi({
						example: Ec2State.STOPPING
					})
				}),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Stop EC2 instance',
			description: 'Stops an existing EC2 instance by providing its Local Resource ID (LRI).'
		},
		reboot: {
			method: 'POST',
			path: '/reboot',
			body: z.object({
				instanceId: z.number().openapi({
					example: 4123
				})
			}),
			responses: {
				201: z.object({
					instanceState: z.nativeEnum(Ec2State).openapi({
						example: Ec2State.PENDING
					})
				}),
				400: ApiErrorSchema,
				404: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Reboot EC2 instance',
			description: 'Reboots an existing EC2 instance by providing its Local Resource ID (LRI).'
		},
		listInstaces: {
			method: 'GET',
			path: '/listInstances',
			query: z.object({
				maxResults: z.number().optional()
			}),
			responses: {
				200: z.object({
					instances: z.array(z.object({}))
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'List EC2 instances',
			description: 'Lists existing EC2 instances.'
		},
	},
	{
		pathPrefix: '/resources/compute/ec2'
	}
);

export { ec2Contract }
