import { ActionData } from "./common";

enum ResourceActionTypes {
	Ec2CreateInstance = "EC2_CREATE_INSTANCE",
	Ec2TerminateInstance = "EC2_TERMINATE_INSTANCE",
	Ec2StartInstance = "EC2_START_INSTANCE",
	Ec2StopInstance = "EC2_STOP_INSTANCE",
	Ec2RebootInstance = "EC2_REBOOT_INSTANCE"
}


/**
 * Application Action Types.
 */
const RESOURCE_ACTIONS: Map<string, ActionData> = new Map();

/* ----- EC2 Resource Actions ----- */
RESOURCE_ACTIONS.set(
	ResourceActionTypes.Ec2CreateInstance,
	{
		type: ResourceActionTypes.Ec2CreateInstance,
		description: "Creates an EC2 instance."
	}
);
RESOURCE_ACTIONS.set(
	ResourceActionTypes.Ec2TerminateInstance,
	{
		type: ResourceActionTypes.Ec2TerminateInstance,
		description: "Terminates an EC2 instance."
	}
);
RESOURCE_ACTIONS.set(
	ResourceActionTypes.Ec2StartInstance, 
	{
		type: ResourceActionTypes.Ec2StartInstance,
		description: "Starts an EC2 instance."
	}
);
RESOURCE_ACTIONS.set(
	ResourceActionTypes.Ec2StopInstance, 
	{
		type: ResourceActionTypes.Ec2StopInstance,
		description: "Stops an EC2 instance."
	}
);
RESOURCE_ACTIONS.set(
	ResourceActionTypes.Ec2RebootInstance,
	{
		type: ResourceActionTypes.Ec2RebootInstance,
		description: "Reboots an EC2 instance."
	}
);


export { RESOURCE_ACTIONS, ResourceActionTypes };
