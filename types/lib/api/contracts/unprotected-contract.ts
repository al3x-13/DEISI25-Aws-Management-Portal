import { initContract } from "@ts-rest/core";
import { authContract } from "./auth-contract";
import { testContract } from "./test-contract";
import { userContract } from "./user-contract";

const c = initContract();

const unprotectedContract = c.router({
	test: testContract,
	auth: authContract,
});

export { unprotectedContract };
