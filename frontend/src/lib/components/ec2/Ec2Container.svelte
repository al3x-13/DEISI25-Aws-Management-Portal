<script lang="ts">
	import { Ec2State, type Ec2Instance } from '@deisi25/types';
	import {
		ActivityIcon,
		FingerprintIcon,
		Play,
		RotateCw,
		ServerIcon,
		Square,
		Trash2
	} from 'lucide-svelte';
	import {
		rebootInstance,
		startInstance,
		stopInstance,
		terminateInstance
	} from '../../../global/ec2-instances';
	import { toast } from 'svelte-sonner';

	export let instance: Ec2Instance;

	async function terminateEC2(id: number) {
		if (await terminateInstance(id)) {
			toast.success('EC2 instance deleted successfullly');
		} else {
			toast.error('Failed to terminate EC2 instance');
		}
	}
</script>

<div
	class="w-full flex items-start justify-between border-2 border-color-primary-light dark:border-color-primary-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3 mt-10"
>
	<div class="flex flex-col">
		<p class="text-xl text-color-primary-light dark:text-color-primary-dark mb-3">
			{instance.InstanceName}
		</p>

		<div class="flex flex-col space-y-1">
			<div class="flex space-x-3">
				<FingerprintIcon size={20} />
				<p>LRI: {instance.LocalInstanceId} | ARI: {instance.AwsInstanceId}</p>
			</div>

			<div class="flex space-x-3">
				<ServerIcon size={20} />
				<p>{instance.InstanceName}</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col">
		<div class="flex space-x-2 mb-2">
			<ActivityIcon size={23} />
			<p>{instance.State}</p>
		</div>

		<div class="flex flex-col space-y-1">
			<button
				disabled={instance.State != Ec2State.STOPPED}
				on:click={async () => {
					instance.State = (await startInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
					toast.success('EC2 instance successfullly started');
				}}
				class="flex items-center justify-start text-green-500 dark:text-green-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
			>
				<Play size={20} />
				<p class="ml-2">Start</p>
			</button>

			<button
				disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
				on:click={async () => {
					instance.State = (await stopInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
					toast.success('EC2 instance successfullly stopped');
				}}
				class="flex items-center justify-start text-red-500 dark:text-red-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
			>
				<Square size={20} />
				<p class="ml-2">Stop</p>
			</button>

			<button
				disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
				on:click={async () => {
					instance.State = (await rebootInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
					toast.success('EC2 instance successfullly rebooted');
				}}
				class="flex items-center justify-start text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark"
			>
				<RotateCw size={20} />
				<p class="ml-2">Reboot</p>
			</button>

			<button
				on:click={async () => await terminateEC2(instance.LocalInstanceId)}
				class="flex items-center justify-start text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark hover:text-red-600 dark:hover:text-red-600"
			>
				<Trash2 size={20} />
				<p class="ml-2">Delete</p>
			</button>
		</div>
	</div>
</div>
