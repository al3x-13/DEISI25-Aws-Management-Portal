import { initContract } from "@ts-rest/core";
import { authContract } from "./auth-contract";
import { testContract } from "./test-contract";

const c = initContract();

const baseContract = c.router(
	{
		test: testContract,
		auth: authContract,
	},
);

export { baseContract };
