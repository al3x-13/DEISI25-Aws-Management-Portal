import { ResponseObject, SecuritySchemeObject } from "openapi3-ts/oas31";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { ZodObject, z } from "zod";

extendZodWithOpenApi(z);

// Security Scheme
export const securityConfig: SecuritySchemeObject = {
	type: 'apiKey',
	name: 'token',
	in: 'cookie',
	description: 'Json Web Token (JWT) that identifies the subject'
};


/* ### General Response Objects ### */

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

export const notFoundRequestResponse: ResponseObject = {
	description: 'Resource not found',
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
