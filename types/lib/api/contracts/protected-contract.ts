import { initContract } from "@ts-rest/core";
import { userContract } from "./user-contract";
import { ec2Contract } from "./resources/ec2-contract";
import { usersContracts } from "./users-contracts";

const c = initContract();

const protectedContract = c.router({
	user: userContract,
	users: usersContracts,
	resources: {
		compute: {
			ec2: ec2Contract,
		}
	}
});

export { protectedContract };
