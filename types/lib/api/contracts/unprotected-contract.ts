import { initContract } from "@ts-rest/core";
import { authContract } from "./auth-contract";
import { testContract } from "./test-contract";
import { inviteContractUnprotected } from "./invites/invite-contract";

const c = initContract();

const unprotectedContract = c.router({
	test: testContract,
	auth: authContract,
	invite: inviteContractUnprotected,
});

export { unprotectedContract };
