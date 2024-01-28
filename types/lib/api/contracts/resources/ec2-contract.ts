import { initContract } from "@ts-rest/core";
import { ApiErrorSchema } from "../../types/error";
import { z } from "zod";

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
					instance: z.object({})
				}),
				400: ApiErrorSchema
			},
			summary: 'Create EC2 instance'
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
				500: ApiErrorSchema
			},
			summary: 'Terminate EC2 instance'
		},
		start: {
			method: 'POST',
			path: '/start',
			body: z.object({
				instanceId: z.string()
			}),
			responses: {
				201: z.object({
					instanceState: z.string()
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Start EC2 instance'
		},
		stop: {
			method: 'POST',
			path: '/stop',
			body: z.object({
				instanceId: z.string()
			}),
			responses: {
				201: z.object({
					instanceState: z.string()
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Stop EC2 instance'
		},
		reboot: {
			method: 'POST',
			path: '/reboot',
			body: z.object({
				instanceId: z.string()
			}),
			responses: {
				201: z.object({
					instanceState: z.string()
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'Reboot EC2 instance'
		},
		listInstaces: {
			method: 'GET',
			path: '/listInstances',
			pathParams: z.object({
				maxResults: z.number()
			}),
			responses: {
				200: z.object({
					instances: z.array(z.object({}))
				}),
				400: ApiErrorSchema,
				500: ApiErrorSchema
			},
			summary: 'List EC2 instances'
		},
	},
	{
		pathPrefix: '/resources/compute/ec2'
	}
);

export { ec2Contract }
