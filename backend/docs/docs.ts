import { OpenAPIObject, OperationObject, SecuritySchemeObject } from "openapi3-ts/oas31";
import { addAuthenticationErrorResponseToPathMethods, addBadRequestResponseToPathMethods, addSecuritySchemeToPathOptions, addServerErrorResponseToPathMethods } from "./docs-helpers";
import { apiErrorSchema, securityConfig } from "./object-schemas";

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
				ApiError: apiErrorSchema,
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
