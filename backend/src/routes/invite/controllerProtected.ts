import { inviteContractProtected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import { initServer } from "@ts-rest/express";
import { ApiError } from "../../../src/utils/errors";
import { createUserInvite, expireUserInvite, getAllUserInvitesValidOnesFirst } from "../../../src/lib/invite/invite-utils";

const server = initServer();

const inviteProtectedController = server.router(inviteContractProtected, {
	createInvite: async ({ req }) => {
		const { role, expirationTimestamp } = req.body;

		if (!role) {
			const error = new ApiError('Invite Creation Failed', "Missing 'uuid' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!expirationTimestamp) {
			const error = new ApiError('Invite Creation Failed', "Missing 'expirationTimestamp' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const expDate = new Date(expirationTimestamp);
		const nowDate = new Date();

		if (nowDate >= expDate) {
			const error = new ApiError('Invite Creation Failed', "Invalid 'expirationTimestamp' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const inviteUUID = await createUserInvite(role, expDate);
		if (inviteUUID === null) {
			const error = new ApiError('Invite Creation Failed', "Could not create user invite");
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		return {
			status: 201,
			body: {
				inviteUUID: inviteUUID
			}
		}
	},
	deactivateInvite: async ({ req }) => {
		const { uuid } = req.body;

		if (!uuid) {
			const error = new ApiError('Invite Deactivation Failed', "Missing 'uuid' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 201,
			body: {
				success: await expireUserInvite(uuid)
			}
		}
	},
	getAllInvites: async ({ req }) => {
		const maxResultsParam = Number(req.query.maxResults);
		const validMaxResults = Number.isInteger(maxResultsParam) && maxResultsParam >= 1 && maxResultsParam < 1000;
		const maxResults = validMaxResults ? maxResultsParam : undefined;

		// return error when 'maxResults' is set but its format is not valid
		if (req.query.maxResults && !validMaxResults) {
			const error = new ApiError(
				'Failed to get user invites', 
				"Invalid 'maxResults' query parameter format"
			);
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				invites: await getAllUserInvitesValidOnesFirst(maxResults)
			}
		}
	}
});

export default inviteProtectedController;
