import { OpenAPIObject } from "openapi3-ts/oas31";
import { addAuthenticationErrorResponseToPathMethods, addBadRequestResponseToPathMethods, addResponseSchemas, addSecuritySchemeToPathOptions, addServerErrorResponseToPathMethods, updateResourceNotFoundRequestResponseToPathMethods } from "./docs-helpers";
import { securityConfig } from "./object-schemas";
import { generateSchema } from "@anatine/zod-openapi";
import { SchemaID, apiSchemas } from "@deisi25/types";

function buildDocsFromTSRestOAS(tsRestOAS: OpenAPIObject): OpenAPIObject {
	const docsOAS: OpenAPIObject = {
		openapi: '3.0.1',
		info: {
			title: tsRestOAS.info.title,
			description: tsRestOAS.info.description,
			version: tsRestOAS.info.version
		},
		paths: tsRestOAS.paths,
		tags: tsRestOAS.tags,
		components: {
			schemas: {
				ApiError: generateSchema(apiSchemas[SchemaID.ApiError]),
				UserInfo: generateSchema(apiSchemas[SchemaID.UserInfo]),
			},
			parameters: {
				ContentTypeHeader: {
					name: 'Content-Type',
					in: 'header',
					required: true,
					schema: {
						type: 'string'
					},
					description: "Header required in all requests. It must bet set to 'application/json'."
				}
			},
			securitySchemes: {
				cookieAuth: securityConfig,
			},
		},
	};

	if (docsOAS.paths != undefined) {
		const unprotectedPaths = [
			'/',
			'/test',
			'/auth/authenticate'
		];

		for (let [path, data] of Object.entries(docsOAS.paths)) {
			data = addBadRequestResponseToPathMethods(data);
			data = addServerErrorResponseToPathMethods(data);
			data = updateResourceNotFoundRequestResponseToPathMethods(data);

			if (!unprotectedPaths.includes(path)) {
				data = addAuthenticationErrorResponseToPathMethods(data);
				data = addSecuritySchemeToPathOptions(data);

				// DEBUG
				// console.log(`Route: ${path}, Data: ${JSON.stringify(data, null, 2)}`);
			}
		}
	}

	return docsOAS;
}

export { buildDocsFromTSRestOAS };
