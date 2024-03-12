import { describe, expect, test } from "@jest/globals";
import { extractJwt } from "./jwt";
import { Request } from "express";

describe("extractJWT", () => {
	test("request with no headers", () => {
		const req = {
			headers: {}
		} as Request<any>;
		expect(extractJwt(req)).toBeNull();
	});

	test("missing 'authorization' header", () => {
		const req = {
			headers: {}
		} as Request<any>;
		expect(extractJwt(req)).toBeNull();
	});

	test("invalid 'authorization' header", () => {
		let req = {
			headers: { 'authorization': '' }
		} as Request<any>;
		expect(extractJwt(req)).toBeNull();

		req = {
			headers: { 'authorization': 'nonsense123' }
		} as Request<any>;
		expect(extractJwt(req)).toBeNull();
	});

	test("valid 'authorization' header", () => {
		let req = {
			headers: { 'authorization': 'Bearer 29jf2032dkl23jdlkj23.fjeowjfe0-92jf.fdsaklfjskal' }
		} as Request<any>;
		expect(extractJwt(req)).toEqual('29jf2032dkl23jdlkj23.fjeowjfe0-92jf.fdsaklfjskal');
	});
});
