import { ResourceType } from "@deisi25/types";
import db from "../../db/db";
import { QueryResult } from "pg";
import { logger } from "../../logging/logging";
import { SSHKey, SSHKeyAccessType } from "@deisi25/types/lib/resources/ssh/ssh";
import { encryptSSHkey } from "./ssh/ssh-utils";


/**
* Create metadata for an application resource (AWS resource) and stores it
* in the database.
*
* @param name Resource name (in the application)
* @param type Resource type
* @param awsResourceId Aws resource id
* @param tags Resource tags
* @param userId Id of the user who created the resource
* @returns Whether the resource metadata was created successfully
*/
export async function createResourceMetadata(
	type: ResourceType, 
	name: string,
	awsResourceId: string,
	tags: string[] | undefined, 
	userId: number
): Promise<boolean> {
	const data = await db.query(`
		INSERT INTO resources (type, name, aws_resource_id, tags, created_by)
		SELECT
			(SELECT id from resource_types WHERE name = $1) AS type,
			$2 AS name,
			$3 AS aws_resource_id,
			$4 AS tags,
			$5 AS created_by
		RETURNING id
		`,
		[ type, name, awsResourceId, tags, userId.toString() ]
	);

	// logging
	if (data.rowCount === 1) {
		logger.info(`Metadata for resource with LRI '${data.rows[0].id}' created successfully`);
		return true;
	} else {
		logger.error(`Failed to create metadata for resource with ARI '${awsResourceId}'`);
		return false;
	}
}


/**
 * Delete metadata for application resources (AWS resources) from the database
 * using Local Resource IDs (LRIs) or the AWS Resource IDs (ARIs).
 *
 * @param resourceIds Resource IDs
 * @returns Whether the metadata deletion was successful
 */
export async function deactivateResource(resourceIds: number[] | string[]): Promise<boolean> {
	if (resourceIds.length === 0) return false;

	const usingLocalResourceId = typeof resourceIds[0] === 'number';
	const idPlaceholders = resourceIds.map((_, idx) => `$${idx + 1}`).join(', ');

	let query: QueryResult<any>;

	if (usingLocalResourceId) {
		query = await db.query(
			`UPDATE resources SET active = FALSE WHERE id IN (${idPlaceholders})`,
			resourceIds
		);
	} else {
		query = await db.query(
			`UPDATE resources SET active = FALSE WHERE aws_resource_id IN (${idPlaceholders})`,
			resourceIds
		);
	}

	// logging
	const idTypeString = usingLocalResourceId ? 'LRIs ->' : 'ARIs ->';
	if (query.rowCount === resourceIds.length) {
		logger.info(`Resources ${idTypeString} '${resourceIds}' deactivated successfully`);
		return true;
	} else {
		logger.error(`Failed to deactivate resources ${idTypeString} '${resourceIds}'`);
		return false;
	}
}


/**
* Add tags to a resource using the Local Resource ID (LRI).
* @param localResourceId Local Resource Id
* @param tags Resource tags to be added
* @returns Whether tags were succesfully added
*/
export async function addResourceTags(localResourceId: number, tags: string[]): Promise<boolean>;
/**
* Add tags to a resource using the AWS Resource ID (ARI).
* @param resourceId AWS Resource Id
* @param tags Resource tags to be added
* @returns Whether tags were succesfully added
*/
export async function addResourceTags(awsResourceId: string, tags: string[]): Promise<boolean>;
export async function addResourceTags(resourceId: number | string, tags: string[]): Promise<boolean> {
	const usingLocalResourceId = typeof resourceId === 'number';
	let operationSucceded = false;

	if (usingLocalResourceId) {
		const query = await db.query(
			'UPDATE resources SET tags = tags || $1 WHERE id = $2',
			[ tags, resourceId ],
		);

		operationSucceded = query.rowCount === 1;
	} else {
		const query = await db.query(
			'UPDATE resources SET tags = tags || $1 WHERE aws_resource_id = $2',
			[ tags, resourceId ],
		);

		operationSucceded = query.rowCount === 1;
	}

	return operationSucceded;
}


/**
* Remove tags from a resource using the Local Resource ID (LRI).
* @param localResourceId Local Resource ID
* @param tags Resource tags to be removed
* @returns Whether tags were succesfully removed
*/
export async function removeResourceTags(localResourceId: number, tags: string[]): Promise<boolean>;
/**
* Remove tags from a resource using the AWS Resource ID.
* @param awsResourceId AWS Resource ID
* @param tags Resource tags to be removed
* @returns Whether tags were succesfully removed
*/
export async function removeResourceTags(awsResourceId: string, tags: string[]): Promise<boolean>;
export async function removeResourceTags(resourceId: number | string, tags: string[]): Promise<boolean> {
	const usingLocalResourceId = typeof resourceId === 'number';
	let operationSucceded = false;

	let tagsToRemovePlaceholders = tags.map((_, index) => `$${index + 2}`).join(', ');

	if (usingLocalResourceId) {
		const query = await db.query(
			`UPDATE resources
			SET tags = (
				SELECT ARRAY_AGG(item) FROM UNNEST(tags) AS t(item)
				WHERE item NOT IN (${tagsToRemovePlaceholders})
			)
			WHERE id = $1
			`,
			[ resourceId, ...tags ]
		);

		operationSucceded = query.rowCount === 1;
	} else {
		const query = await db.query(
			`UPDATE resources
			SET tags = (
				SELECT ARRAY_AGG(item) FROM UNNEST(tags) AS t(item)
				WHERE item NOT IN (${tagsToRemovePlaceholders})
			)
			WHERE aws_resource_id = $1
			`,
			[ resourceId, ...tags ]
		);

		operationSucceded = query.rowCount === 1;
	}

	return operationSucceded;
}


/**
 * Update resource name using the Local Resource ID (LRI).
 * @param localResourceId Local Resource ID
 * @param name New resource name
 * @returns Whether the resource name was successfully updated
 */
export async function updateResourceName(localResourceId: number, name: string): Promise<boolean>;
/**
 * Update resource name using the AWS Resource ID (ARI).
 * @param awsResourceId AWS Resource ID
 * @param name New resource name
 * @returns Whether the resource name aws successfully updated
 */
export async function updateResourceName(awsResourceId: string, name: string): Promise<boolean>;
export async function updateResourceName(resourceId: number | string, name: string): Promise<boolean> {
	const usingLocalResourceId = typeof resourceId === 'number';
	let operationSucceded = false;

	if (usingLocalResourceId) {
		const query = await db.query(
			'UPDATE resources SET name = $1 WHERE id = $2',
			[ name, resourceId ]
		);

		operationSucceded = query.rowCount === 1;
	} else {
		const query = await db.query(
			'UPDATE resources SET name = $1 WHERE aws_resource_id = $2',
			[ name, resourceId ]
		);

		operationSucceded = query.rowCount === 1;
	}

	return operationSucceded;
}


/**
 * Check whether there is an existing EC2 instance with the given name.
 * @param instanceName Instance Name
 * @returns Whether an instance with the name exists
 */
export async function ec2InstanceNameExists(instanceName: string): Promise<boolean> {
	const query = await db.query(
		'SELECT name FROM resources WHERE type = 1 AND name = $1',
		[ instanceName ]
	)
	return query.rowCount! > 0;
}


/**
 * Creates metadata for an AWS SSH key and stores it in the database.
 * @param key SSH key
 * @param userId userId
 * @returns Whether the resource metadata was created successfully
 */
export async function createSSHKeyMetadata(key: SSHKey, userId: number): Promise<boolean> {
	const encryptedPrivKey = encryptSSHkey(key.PrivateKeyValue);

	const query = await db.query(`
		INSERT INTO ssh_keys (name, key_pair_type, private_key_file_format, key_access_type, private_key_value,
		created_by) VALUES ($1, $2, $3, $4, $5, $6)
		`,
		[ key.Name, key.KeyPairType, key.PrivateKeyFileFormat, key.KeyAccessType, encryptedPrivKey, userId ]
	);

	if (query.rowCount === 1) {
		logger.info(`Metadata ssh key '${key.Name}' created successfully`);
		return true;
	} else {
		logger.error(`Failed to create metadata for ssh key with name '${key.Name}'`);
		return false;
	}
}


/**
 * Deletes existing metadata for an AWS SSH key.
 * @param keyName Key name
 * @returns Whether the metadata was successfully deleted
 */
export async function deleteSSHKeyMetadata(keyName: string): Promise<boolean> {
	const query = await db.query(
		'DELETE FROM ssh_keys WHERE name = $1',
		[ keyName ]
	);

	if (query.rowCount === 1) {
		logger.info(`SSH key '${keyName}' deleted successfully`);
		return true;
	} else {
		logger.error(`Failed to delete SSH key '${keyName}'`);
		return false;
	}
}


/**
 * Updates the access type of an existing SSH key.
 * @param newAccessType New access type
 * @returns Whether the access type was updated successfully
 */
export async function updateSSHKeyAccessType(keyName: string, newAccessType: SSHKeyAccessType): Promise<boolean> {
	const query = await db.query(
		'UPDATE ssh_keys SET key_access_type = $1 WHERE name = $2',
		[ newAccessType, keyName ]
	);

	if (query.rowCount === 1) {
		logger.info(`SSH key '${keyName}' access type updated successfully`);
		return true;
	} else {
		logger.error(`Failed to update access type of SSH key '${keyName}'`);
		return false;
	}
}
