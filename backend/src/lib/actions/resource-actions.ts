import { ResourceActionData, ResourceActionTypes } from "@deisi25/types";
import db from "../../db/db";


/**
 * Creates a new resource action.
 * @param actionType Resource Action Type
 * @param localResourceId Local Resource ID (LRI)
 * @param userId Author ID
 * @returns Whether the resource action was created successfully.
 */
export async function createResourceAction(actionType: ResourceActionTypes, localResourceId: number, userId: number): Promise<boolean> {
	const query = await db.query(
		'INSERT INTO resource_actions (action, local_resource_id, user_id) VALUES ($1, $2, $3)',
		[ actionType, localResourceId, userId ]
	);
	return query.rowCount === 1;
}


/**
 * Retrieve a resource action.
 * @param actionId Action ID
 * @returns Resource Action Data or null if the provided action ID does not exist.
 */
export async function getResourceActionFromActionId(actionId: number): Promise<ResourceActionData | null> {
	const query = await db.query(
		'SELECT * FROM resource_actions WHERE id = $1',
		[ actionId ]
	);

	if (query.rows.length === 0) return null;

	return {
		actionId: query.rows[0].id,
		actionType: query.rows[0].action,
		localResourceId: query.rows[0].local_resource_id,
		userId: query.rows[0].user_id,
		actionTimestamp: query.rows[0].timestamp
	};
}


/**
 * Retrieve resource actions for a local resource.
 * @param localResourceId Local Resource ID (LRI)
 * @returns Resource actions or null if there are no actions for the provided LRI.
 */
export async function getResourceActionFromLRI(localResourceId: number): Promise<ResourceActionData[] | null> {
	const query = await db.query(
		'SELECT * FROM resource_actions WHERE local_resource_id = $1',
		[ localResourceId ]
	);

	if (query.rows.length === 0) return null;

	const resourceActions: ResourceActionData[] = [];
	query.rows.map((action) => {
		resourceActions.push({
			actionId: action.id,
			actionType: action.action,
			localResourceId: action.local_resource_id,
			userId: action.user_id,
			actionTimestamp: action.timestamp
		});
	});
	return resourceActions;
}
