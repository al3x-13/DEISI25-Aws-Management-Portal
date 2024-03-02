import { describe, test, expect } from "@jest/globals";
import { isContentTypeValid, validateRequestHeaders } from "./endpoint-utils";
import { TsRestRequest } from "@ts-rest/express";

describe("isContentTypeValid", () => {
	test("Invalid header types", () => {
		let req = {
			params: {},
			body: {},
			query: {},
			headers: { 'content-type': 'text/html' },
			tsRestRoute: {},
		} as TsRestRequest<any>;
		expect(isContentTypeValid(req)).toBe(false);

		req = {
			params: {},
			body: {},
			query: {},
			headers: { 'content-type': 'text/xml' },
			tsRestRoute: {},
		} as TsRestRequest<any>;
		expect(isContentTypeValid(req)).toBe(false);

		req = {
			params: {},
			body: {},
			query: {},
			headers: { 'content-type': 'f02jfk2ef@3f' },
			tsRestRoute: {},
		} as TsRestRequest<any>;
		expect(isContentTypeValid(req)).toBe(false);

		req = {
			params: {},
			body: {},
			query: {},
			headers: { 'content-type': '' },
			tsRestRoute: {},
		} as TsRestRequest<any>;
		expect(isContentTypeValid(req)).toBe(false);
	});

	test("Valid header types", () => {
		let req = {
			params: {},
			body: {},
			query: {},
			headers: { 'content-type': 'application/json' },
			tsRestRoute: {},
		} as TsRestRequest<any>;
		expect(isContentTypeValid(req)).toBe(true);
	});
});

describe("validateRequestHeaders", () => {
	test("Missing 'Content-Type' should return 400", () => {
		const req = {} as TsRestRequest<any>;
		const result = validateRequestHeaders(req);
		expect(result).not.toBeNull();
		expect(result?.status).toBe(400);
	});

	test("Invalid 'Content-Type' should return 400", () => {
		let req = {
			headers: { 'content-type': 'application/xml' }
		} as TsRestRequest<any>;
		let result = validateRequestHeaders(req);
		expect(result).not.toBeNull();
		expect(result?.status).toBe(400);

		req = {
			headers: { 'content-type': 'text/plain' }
		} as TsRestRequest<any>;
		expect(result).not.toBeNull();
		expect(result?.status).toBe(400);
	});

	test("Valid request headers", () => {
		const req = {
			headers: { 'content-type': 'application/json' }
		} as TsRestRequest<any>;
		const result = validateRequestHeaders(req);
		expect(result).toBeNull();
	});
});
