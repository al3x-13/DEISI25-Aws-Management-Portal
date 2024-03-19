import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ApiErrorSchema } from "../types/error";
import { SchemaID, apiSchemas } from "../schemas/response-objects";

const c = initContract();

const usersContracts = c.router(
	{
		default: {
			method: 'GET',
			path: '/',
			responses: {
				200: apiSchemas[SchemaID.UsersInfo],
				401: ApiErrorSchema,
			},
			summary: 'Get users info',
		}
	},
	{
		pathPrefix: '/users'
	}
);

export { usersContracts };
