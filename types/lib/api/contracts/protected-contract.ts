import { initContract } from "@ts-rest/core";
import { userContract } from "./user-contract";
import { ec2Contract } from "./resources/ec2-contract";
import { sshContract } from "./resources/ssh-contract";

const c = initContract();

const protectedContract = c.router({
	user: userContract,
	resources: {
		compute: {
			ec2: ec2Contract,
			ssh: sshContract,
		}
	}
});

export { protectedContract };
