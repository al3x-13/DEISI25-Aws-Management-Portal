import { getInstances } from "../../../../../global/ec2-instances";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	return {
		instances: getInstances(),
		token: cookies.get('token'),
	};
}
