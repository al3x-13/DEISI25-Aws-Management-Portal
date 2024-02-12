<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import {
		terminateInstance,
		listInstancesClientSide,
		startInstance,
		stopInstance,
		rebootInstance
	} from '../../../../../global/ec2-instances';
	import { toast } from 'svelte-sonner';
	import { Play, RotateCw, Square, Trash2 } from 'lucide-svelte';
	import { Ec2State, type Ec2Instance } from '@deisi25/types';

	export let data: PageData;

	let instances: Ec2Instance[] = data.instances || [];

	async function terminateEC2(id: number) {
		if (await terminateInstance(id)) {
			toast.success('EC2 instance deleted successfullly');
			await updateInstances();
		} else {
			toast.error('Failed to terminate EC2 instance');
		}
	}

	async function updateInstances() {
		instances = await listInstancesClientSide();
	}
</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center">
	<PageTitleWithButton
		title="EC2 Instances"
		buttonText="+ New"
		buttonHref="/resources/compute/ec2/create"
	/>

	<button
		on:click={async () => await updateInstances()}
		class="mt-12 self-end text-text-light dark:text-text-dark border-[2px] border-text-light dark:border-text-dark rounded-custom hover:bg-text-light dark:hover:bg-text-dark hover:text-white dark:hover:text-white px-2.5 py-1.5 transition duration-100"
	>
		<RotateCw size={30} />
	</button>

	<Table.Root class="mt-4 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Aws ID</Table.Head
				>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Name</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Tags</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">State</Table.Head>
				<Table.Head class="text-right text-color-primary-light dark:text-color-primary-dark"
					>Actions</Table.Head
				>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each instances as instance}
				<Table.Row class="text-lg">
					<Table.Cell
						class="w-[300px] font-bold text-color-primary-light dark:text-color-primary-dark"
						>{instance.AwsInstanceId}</Table.Cell
					>
					<Table.Cell class="text-text-light dark:text-text-dark"
						>{instance.InstanceName}</Table.Cell
					>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.Tags}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.State}</Table.Cell>
					<Table.Cell class="text-right flex items-center justify-end space-x-2">
						<button
							disabled={instance.State != Ec2State.STOPPED}
							on:click={async () => {
								instance.State =
									(await startInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
								toast.success('EC2 instance successfullly started');
							}}
							class="text-green-500 dark:text-green-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<Play size={25} />
						</button>

						<button
							disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
							on:click={async () => {
								instance.State = (await stopInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
								toast.success('EC2 instance successfullly stopped');
							}}
							class="text-red-500 dark:text-red-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<Square size={25} />
						</button>

						<button
							disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
							on:click={async () => {
								instance.State =
									(await rebootInstance(instance.LocalInstanceId)) || Ec2State.UNKNOWN;
								toast.success('EC2 instance successfullly rebooted');
							}}
							class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<RotateCw size={25} />
						</button>

						<button
							on:click={async () => await terminateEC2(instance.LocalInstanceId)}
							class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark hover:text-red-600 dark:hover:text-red-600"
						>
							<Trash2 size={25} />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
