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
function addResourceTags(localResourceId: number, tags: string[]): boolean;
/**
* Add tags to a resource using the AWS Resource ID.
* @param resourceId Application Resource Id
* @param tags Resource tags to be added
* @returns Whether tags were succesfully added
*/
function addResourceTags(awsResourceId: string, tags: string[]): boolean;
function addResourceTags(resourceId: number | string, tags: string[]): boolean {
	const usingLocalResourceId = typeof resourceId === 'number';

	if (usingLocalResourceId) {
		// TODO: implement using local id
	} else {
		// TODO: implement using aws id
	}

	return false;
}


/**
* Remove tags from a resource using the Application Resource ID (ARI).
* @param localResourceId Application Resource ID
* @param tags Resource tags to be removed
* @returns Whether tags were succesfully removed
*/
function removeResourceTags(localResourceId: number, tags: string[]): boolean;
/**
* Remove tags from a resource using the AWS Resource ID.
* @param awsResourceId AWS Resource ID
* @param tags Resource tags to be removed
* @returns Whether tags were succesfully removed
*/
function removeResourceTags(awsResourceId: string, tags: string[]): boolean;
function removeResourceTags(resourceId: number | string, tags: string[]): boolean {
	const usingLocalResourceId = typeof resourceId === 'number';

	if (usingLocalResourceId) {
		// TODO: implement using local id
	} else {
		// TODO: implement using aws id
	}

	return false;
}
