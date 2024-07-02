import { inviteContractUnprotected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import { initServer } from "@ts-rest/express";
import { ApiError } from "../../utils/errors";
import { checkInviteValidity, getInviteRoleId } from "../../../src/lib/invite/invite-utils";
import { createNewUser } from "../../../src/lib/users/user-manager";

const server = initServer();

const inviteUnprotectedController = server.router(inviteContractUnprotected, {
	checkValidity: async ({ req }) => {
		const { uuid } = req.body;

		if (!uuid) {
			const error = new ApiError('Validity Check Failed', "Missing 'uuid' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				valid: await checkInviteValidity(uuid)
			}
		}
	},
	submitInvite: async ({ req }) => {
		const { 
			uuid,
			username,
			email,
			password
		} = req.body;

		if (!uuid) {
			const error = new ApiError('Invite Submission Failed', "Missing 'uuid' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!username) {
			const error = new ApiError('Invite Submission Failed', "Missing 'username' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!email) {
			const error = new ApiError('Invite Submission Failed', "Missing 'email' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!password) {
			const error = new ApiError('Invite Submission Failed', "Missing 'password' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const role = await getInviteRoleId(uuid);

		if (role === null) {
			const error = new ApiError('Invite Submission Failed', "Invite with given 'uuid' not found");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 201,
			body: {
				success: await createNewUser(username, email, password, role)
			}
		}
	}
});

export default inviteUnprotectedController;
