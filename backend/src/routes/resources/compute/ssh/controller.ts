import { CreateKeyPairCommand, CreateKeyPairCommandInput, CreateKeyPairCommandOutput, DeleteKeyPairCommand, DeleteKeyPairCommandInput, DeleteKeyPairCommandOutput, EC2Client, KeyFormat, KeyType } from "@aws-sdk/client-ec2";
import { fromEnv } from "@aws-sdk/credential-providers";
import { sshContract } from "@deisi25/types";
import { SSHKey, SSHKeyPairType, SSHPrivateKeyFileFormat } from "@deisi25/types/lib/resources/ssh/ssh";
import { initServer } from "@ts-rest/express";
import dotenv from "dotenv";
import { getUserIdFromRequestCookies } from "../../../../auth/auth-utils";
import { createSSHKeyMetadata, deleteSSHKeyMetadata, updateSSHKeyAccessType } from "../../../../lib/resources/metadata";
import { checkKeyNameAvailability, getUserAccessibleSSHKeys, isSSHKeyOwner } from "../../../../lib/resources/ssh/ssh-utils";
import { logger } from "../../../../logging/logging";
import { ApiError } from "../../../../utils/errors";

dotenv.config();

const client = new EC2Client({
	credentials: fromEnv(),
	region: process.env.AWS_DEFAULT_REGION
});

const server = initServer();

const sshController = server.router(sshContract, {
	create: async ({req}) => {
		const { name, keyPairType, privateKeyFileFormat, keyAccessType } = req.body;

		if (!name) {
			const error = new ApiError('SSH Key Creation Failed', "Missing 'name' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!keyPairType) {
			const error = new ApiError('SSH Key Creation Failed', "Missing 'keyPairType' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}
		
		if (!privateKeyFileFormat) {
			const error = new ApiError('SSH Key Creation Failed', "Missing 'privateKeyFileFormat' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!keyAccessType) {
			const error = new ApiError('SSH Key Creation Failed', "Missing 'keyAccessType' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const commandInput: CreateKeyPairCommandInput = {
			KeyName: name,
			KeyFormat: privateKeyFileFormat === SSHPrivateKeyFileFormat.PEM ? KeyFormat.pem : KeyFormat.ppk,
			KeyType: keyPairType === SSHKeyPairType.RSA ? KeyType.rsa : KeyType.ed25519
		};

		const command = new CreateKeyPairCommand(commandInput);
		let response: CreateKeyPairCommandOutput;

		try {
			response = await client.send(command);
		} catch (err) {
			logger.error(`Failed to create SSH key: ${err}`);
			const error = new ApiError('SSH Key Creation Failed', 'Could not create SSH key');
			return {
				status: 500,
				body: error.toJSON()
				
			};
		}

		const sshKey: SSHKey = {
			Name: name,
			KeyPairType: keyPairType,
			PrivateKeyFileFormat: privateKeyFileFormat,
			KeyAccessType: keyAccessType,
			PrivateKeyValue: response.KeyMaterial!
		};

		const userId = getUserIdFromRequestCookies(req);

		// metadata creation
		await createSSHKeyMetadata(sshKey, userId);

		return {
			status: 201,
			body: {
				sshKey: sshKey
			}
		}
	},
	delete: async ({req}) => {
		const { keyName } = req.body;

		if (!keyName) {
			const error = new ApiError('SSH Key Deletion Failed', "Missing 'keyName' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const userId = getUserIdFromRequestCookies(req);
		const requesterIsKeyOwner = await isSSHKeyOwner(keyName, userId);
		if (!requesterIsKeyOwner) {
			const error = new ApiError('SSH Key Deletion Failed', 'Requester does not own the key');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		const commandInput: DeleteKeyPairCommandInput = {
			KeyName: keyName
		};
		const command: DeleteKeyPairCommand = new DeleteKeyPairCommand(commandInput);
		let response: DeleteKeyPairCommandOutput;

		try {
			response = await client.send(command);
		} catch (err) {
			logger.error(`Failed to delete SSH key: ${err}`);
			const error = new ApiError('SSH Key Deletion Failed', 'Could not delete SSH key');
			return {
				status: 500,
				body: error.toJSON()
				
			};
		}

		// delete metadata
		await deleteSSHKeyMetadata(keyName);

		return {
			status: 200,
			body: {
				success: response.Return ?? false
			}
		}
	},
	updateAccessType: async ({req}) => {
		const { keyName, keyAccessType } = req.body;

		if (!keyName) {
			const error = new ApiError('SSH Key Deletion Failed', "Missing 'keyName' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!keyAccessType) {
			const error = new ApiError('SSH Key Deletion Failed', "Missing 'keyAccessType' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const userId = getUserIdFromRequestCookies(req);
		const requesterIsKeyOwner = await isSSHKeyOwner(keyName, userId);
		if (!requesterIsKeyOwner) {
			const error = new ApiError('SSH Key Deletion Failed', 'Requester does not own the key');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		const success = await updateSSHKeyAccessType(keyName, keyAccessType);

		if (success) {
			return {
				status: 201,
				body: { success: true }
			}
		}

		const error = new ApiError('SSH Key Update Failed', 'Could not update key access type');
		return {
			status: 500,
			body: error.toJSON()
		}
	},
	listKeys: async ({ req }) => {
		const maxResultsParam = Number(req.query.maxResults);
		const validMaxResults = Number.isInteger(maxResultsParam) && maxResultsParam >= 1 && maxResultsParam < 100;
		const maxResults = validMaxResults ? maxResultsParam : -1;

		// return error when 'maxResults' is set but its format is not valid
		if (req.query.maxResults && !validMaxResults) {
			const error = new ApiError(
				'Failed to get EC2 instances', 
				"Invalid 'maxResults' query parameter format"
			);
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const { token } = req.cookies;
		const userId = getUserIdFromRequestCookies(token);
		let sshKeys = await getUserAccessibleSSHKeys(userId);

		if (maxResults !== -1) {
			sshKeys = sshKeys.slice(0, maxResults);
		}

		return {
			status: 200,
			body: {
				sshKeys: sshKeys
			}
		}
	},
	checkNameAvailability: async ({ req }) => {
		const { keyName } = req.body;

		if (!keyName) {
			const error = new ApiError('SSH Key Deletion Failed', "Missing 'keyName' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const availability = await checkKeyNameAvailability(keyName);

		return {
			status: 200,
			body: {
				available: availability
			}
		}
	}
});

export default sshController;
