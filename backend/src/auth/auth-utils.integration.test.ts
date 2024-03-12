import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { validateUserCredentials } from "./auth-utils";
import db from "../db/db";
import dotenv from "dotenv";

dotenv.config();

beforeAll(() => {
	db.initializeConnection(process.env.DB_URL, () => {});
});

afterAll(async () => {
	await db.closeConnection();
});

describe("validateUserCredentials", () => {
	test("invalid username and password", async () => {
		let result = await validateUserCredentials('johnweak', 'keanu');
		expect(result).toBe(false);

		result = await validateUserCredentials('itsamemario', 'whocares213');
		expect(result).toBe(false);
	});

	test("invalid username", async () => {
		const result = await validateUserCredentials('doesnotexist', 'yesyesyes');
		expect(result).toBe(false);
	});

	test("invalid password", async () => {
		let result = await validateUserCredentials('root', 'totallyTheRightPassword');
		expect(result).toBe(false);

		result = await validateUserCredentials('john', 'itsmejohn');
		expect(result).toBe(false);
	});

	test("valid credentials", async () => {
		let result = await validateUserCredentials('root', 'root');
		expect(result).toBe(true);

		result = await validateUserCredentials('john', 'john');
		expect(result).toBe(true);
	});
});
