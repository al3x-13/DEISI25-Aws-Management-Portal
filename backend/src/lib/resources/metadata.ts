import { ResourceType } from "@deisi25/types";
import db from "../../db/db";

/**
* Creates metadata for an application resource (AWS resource) and stores it
* in the database.
*
* @param type Resource type
* @param name Resource name (in the application)
* @param tags Resource tags
* @param userId Id of the user who created the resource
* @param awsResourceId Aws resource id
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
		`,
		[ type, name, awsResourceId, tags, userId.toString() ]
	);

	return data.rowCount === 1;
}


/**
* Add tags to a resource using the Application Resource ID (ARI).
* @param localResourceId Application Resource Id
* @param tags Resource tags to be added
* @returns Whether tags were succesfully added
*/
export async function addResourceTags(localResourceId: number, tags: string[]): Promise<boolean>;
/**
* Add tags to a resource using the AWS Resource ID.
* @param resourceId Application Resource Id
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
* Remove tags from a resource using the Application Resource ID (ARI).
* @param localResourceId Application Resource ID
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
 * Update resource name using the Application Resource ID (ARI).
 * @param localResourceId Application Resource ID
 * @param name New resource name
 * @returns Whether the resource name was successfully updated
 */
export async function updateResourceName(localResourceId: number, name: string): Promise<boolean>;
/**
 * Update resource name using the AWS Resource ID.
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
