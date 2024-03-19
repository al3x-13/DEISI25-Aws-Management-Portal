import { ZodObject } from "zod";
import { z } from "zod";

export enum SchemaID {
	ApiError = 'ApiError',
	UserInfo = 'UserInfo',
	UsersInfo = 'UsersInfo',
}

export interface ApiSchemasDict {
	[key: string]: ZodObject<any>;
}


// Open Api schemas
export const apiSchemas: ApiSchemasDict = {};

apiSchemas[SchemaID.ApiError] = z.object(
	{
		type: z.string(),
		message: z.string(),
		hint: z.string()
	}).openapi({
		title: 'API Error',
		description: 'Describes an error from the backend API.'
	}
);

apiSchemas[SchemaID.UserInfo] = z.object(
	{
		id: z.number().openapi({
			example: 1337
		}),
		username: z.string().openapi({
			example: 'j0hn.w3ak'
		}),
		role: z.string().openapi({
			example: 'user'
		}),
	}).openapi({
		title: 'User Info',
		description: 'General information about a user.',
	}
);

apiSchemas[SchemaID.UsersInfo] = z.object({
	users:z.array(z.object(
	{
		id: z.number().openapi({
			example: 1337
		}),
		email: z.number().openapi({
			example: 'example@gmail.com'
		}),
		username: z.string().openapi({
			example: 'j0hn.w3ak'
		}),
		role: z.string().openapi({
			example: 'user'
		}),
		createdAt: z.string().openapi({}),
	}))}).openapi({
		title: 'Users Info',
		description: 'General information about all users.',
	}
);
