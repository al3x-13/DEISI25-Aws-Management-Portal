import { inviteContractProtected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import { initServer } from "@ts-rest/express";
import { ApiError } from "../../../src/utils/errors";

const server = initServer();

const inviteProtectedController = server.router(inviteContractProtected, {
	createInvite: async ({ req }) => {
		const { role, expirationTimestamp } = req.body;

		if (!role) {
			const error = new ApiError('Validity Check Failed', "Missing 'uuid' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 201,
			body: {
				inviteUUID: 'TODO'
			}
		}
	}
});
