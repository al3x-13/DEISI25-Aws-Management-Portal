import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import db from "backend/src/db/db";
import { getUserByID, getUserByUsername, getUserPasswordHash, getUserRole, usernameExists } from "./user-manager";

beforeAll(async () => {
	db.initializeConnection(process.env.DB_URL, () => {});

	await db.query(
		'INSERT INTO users (id, username, password_hash, email, role) VALUES ($1, $2, $3, $4, $5)',
		[ 3458, 'john347', 'f320jfke2opfj2k', 'john347@deisi25.tfc', 3 ]
	);

	await db.query(
		'INSERT INTO users (id, username, password_hash, email, role) VALUES ($1, $2, $3, $4, $5)',
		[ 4240, 'nick324', 'effe209ijf2fasvccn', 'nick324@deisi25.tfc', 3 ]
	);

	await db.query(
		'INSERT INTO users (id, username, password_hash, email, role) VALUES ($1, $2, $3, $4, $5)',
		[ 4533, 'ben324', 'kjfdskf02ejf3213', 'ben324@deisi25.tfc', 3 ]
	);
});

afterAll(async () => {
	await db.query(
		'DELETE FROM users WHERE id in ($1, $2, $3)',
		[ 3458, 4240, 4533 ]
	);

	await db.closeConnection();
});

describe("usernameExists", () => {
	test("non existent usernames", async () => {
		expect(await usernameExists('thisuserdoesnotexist')).toBe(false);
		expect(await usernameExists('idonotexist324')).toBe(false);
	});

	test("valid usernames", async () => {
		expect(await usernameExists('john347')).toBe(true);
		expect(await usernameExists('nick324')).toBe(true);
	});
});

describe("getUserById", () => {
	test("invalid ids", async () => {
		expect(await getUserByID(4324)).toBeNull();
		expect(await getUserByID(9827)).toBeNull();
	});

	test("valid ids", async () => {
		expect(await getUserByID(3458))
			.toMatchObject({
				id: 3458,
				username: 'john347',
				passwordHash: 'f320jfke2opfj2k',
				email: 'john347@deisi25.tfc',
				role: {
					id: 3,
					role: 'user'
				}
			})

		expect(await getUserByID(4240))
			.toMatchObject({
				id: 4240,
				username: 'nick324',
				passwordHash: 'effe209ijf2fasvccn',
				email: 'nick324@deisi25.tfc',
				role: {
					id: 3,
					role: 'user'
				}
			});
	});
});

describe("getUserByUsername", () => {
	test("invalid usernames", async () => {
		expect(await getUserByUsername('thisuserdoesnotexist')).toBeNull();
		expect(await getUserByUsername('idonotexist324')).toBeNull();
	});

	test("valid usernames", async () => {
		expect(await getUserByUsername('john347'))
			.toMatchObject({
				id: 3458,
				username: 'john347',
				passwordHash: 'f320jfke2opfj2k',
				email: 'john347@deisi25.tfc',
				role: {
					id: 3,
					role: 'user'
				}
			});

		expect(await getUserByUsername('nick324'))
			.toMatchObject({
				id: 4240,
				username: 'nick324',
				passwordHash: 'effe209ijf2fasvccn',
				email: 'nick324@deisi25.tfc',
				role: {
					id: 3,
					role: 'user'
				}
			});
	});
});

describe("getUserRole", () => {
	test("invalid users", async  () => {
		expect(await getUserRole(3243)).toBeNull();
		expect(await getUserRole(30928)).toBeNull();
		expect(await getUserRole('fepwofjwffew')).toBeNull();
	});

	test("valid ids", async () => {
		expect(await getUserRole(3458)).toMatchObject({ id: 3, role: 'user' });
		expect(await getUserRole(4240)).toMatchObject({ id: 3, role: 'user' });
	});

	test("valid usernames", async () => {
		expect(await getUserRole('nick324')).toBe({ id: 3, role: 'user' });
		expect(await getUserRole('ben324')).toBe({ id: 3, role: 'user' });
	});
});

describe("getUserPasswordHash", () => {
	test("invalid usernames", async () => {
		expect(await getUserPasswordHash('thisuserdoesnotexist')).toBeNull();
		expect(await getUserPasswordHash('lkajffjaoiewhf')).toBeNull();
	});

	test("valid usernames", async () => {
		expect(await getUserPasswordHash('john347')).toBe('f320jfke2opfj2k');
		expect(await getUserPasswordHash('nick324')).toBe('effe209ijf2fasvccn');
	});
});
