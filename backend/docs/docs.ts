import { OpenAPIObject, OperationObject, SecuritySchemeObject } from "openapi3-ts/oas31";
import { addBadRequestResponseToPathMethods } from "./docs-helpers";

function buildDocsFromTSRestOAS(tsRestOAS: OpenAPIObject): OpenAPIObject {
	const securityConfig: SecuritySchemeObject = {
		type: 'apiKey',
		name: 'token',
		in: 'cookie',
		description: 'Json Web Token (JWT) that identifies the subject'
	};

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


	tsRestOAS.components = {
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
		headers: {
			ContentTypeHeader: {
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
		...tsRestOAS.components
	};


	// if (docsOAS.paths != undefined) {
	// 	for (let [path, data] of Object.entries(docsOAS.paths)) {
	// 		const unprotectedPaths = [
	// 			'/',
	// 			'/test',
	// 			'/auth/authenticate'
	// 		];
	//
	// 		if (unprotectedPaths.includes(path)) {
	// 			addBadRequestResponseToPathMethods(data);
	// 			// data = {
	// 			// 	get: undefined,
	// 			// 	options: {
	// 			// 		security: [
	// 			// 			{
	// 			// 				cookieAuth: [],
	// 			// 			}
	// 			// 		],
	// 			// 		...data.options
	// 			// 	},
	// 			// 	...data
	// 			// }
	//
	// 			console.log(`Route: ${path}, Data: ${JSON.stringify(data, null, 2)}`);
	// 		}
	// 	}
	// }

	return docsOAS;
}

export { buildDocsFromTSRestOAS };
