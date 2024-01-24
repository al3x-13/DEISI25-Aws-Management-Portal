import type { OutInstance } from "../../../../../global/ec2-instances";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');

	// temp type
	type EC2Instance = {
		Id: string;
		InstanceName: string;
		InstanceType: string;
		AMI: string;
		StorageType: string;
		StorageSize: number | string;
	};

	const instances: OutInstance[] | null = await fetch(
		'http://localhost:3000/resources/compute/ec2/listInstances',
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": `token=${token}`,
			},
		},
	).then(async (res) => {
		if (res.status !== 200) return null;

		const data: {instances: OutInstance[]} = await res.json();
		const instances: OutInstance[] = data.instances;
		return instances;
	});

	return {
		instances: instances,
	};
}
