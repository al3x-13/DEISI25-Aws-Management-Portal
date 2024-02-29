import { describe, test, expect } from "@jest/globals";
import { isContentTypeValid } from "./endpoint-utils";
import { TsRestRequest } from "@ts-rest/express";

describe("'Content-Type' header validation", () => {
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
