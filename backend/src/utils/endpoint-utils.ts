import { ApiError, ApiErrorData } from "./errors";
import { TsRestRequest } from "@ts-rest/express";

export function isContentTypeValid(req: TsRestRequest<any>) {
	return req.headers['content-type'] == 'application/json';
}

export function validateRequestHeaders(req: TsRestRequest<any>): ApiErrorData | null {
	if (!req.headers || !req.headers['content-type']) {
		const error = new ApiError(
			"Bad Request", 
			"Missing 'Content-Type' header", "Set the 'Content-Type' header to 'application/json'"
		);
		return {
			status: 400,
			error: error.toJSON()
		}
	}

	if (!isContentTypeValid(req)) {
		const error = new ApiError(
			"Bad Request", 
			"Invalid 'Content-Type' header", "The 'Content-Type' header must be set to 'application/json'"
		);
		return {
			status: 400,
			error: error.toJSON()
		}
	}
	return null;
}
