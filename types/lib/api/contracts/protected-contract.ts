import { initContract } from "@ts-rest/core";
import { userContract } from "./user-contract";

const c = initContract();

const protectedContract = c.router({
	user: userContract,
});

export { protectedContract };
