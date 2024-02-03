import { ResponseObject, SchemaObject, SecuritySchemeObject } from "openapi3-ts/oas31";

export const securityConfig: SecuritySchemeObject = {
	type: 'apiKey',
	name: 'token',
	in: 'cookie',
	description: 'Json Web Token (JWT) that identifies the subject'
};

export const apiErrorSchema: SchemaObject = {
	type: 'object',
	properties: {
		type: {
			type: 'string'
		},
		message: {
			type: 'string'
		},
		hint: {
			type: 'string'
		}
	}
};

export const badRequestResponse: ResponseObject = {
	description: 'Bad request',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/ApiError'
			}
		}
	}
}

export const serverErrorResponse: ResponseObject = {
	description: 'Server error',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/ApiError'
			}
		}
	}
}

export const authenticationErrorResponse: ResponseObject = {
	description: 'Authentication error',
	content: {
		'application/json': {
			schema: {
				$ref: '#/components/schemas/ApiError'
			}
		}
	}
}
