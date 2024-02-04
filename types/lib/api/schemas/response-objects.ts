import { ZodObject } from "zod";
import { z } from "zod";

export enum SchemaID {
	ApiError = 'ApiError',
	UserInfo = 'UserInfo',
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


