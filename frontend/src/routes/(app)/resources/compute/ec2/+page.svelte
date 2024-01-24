<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ec2Instances,
		getInstances,
		terminateInstance,
		type OutInstance,
		Ec2State,
		listInstancesClientSide,
		startInstance,
		stopInstance,
		rebootInstance
	} from '../../../../../global/ec2-instances';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Play, RotateCw, Square, Trash2 } from 'lucide-svelte';

	export let data: PageData;

	let instances: OutInstance[] = data.instances || [];

	async function terminateEC2(id: string) {
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
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">ID</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Name</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark"
					>Instance Type</Table.Head
				>
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
						>{instance.Id}</Table.Cell
					>
					<Table.Cell class="text-text-light dark:text-text-dark"
						>{instance.InstanceName}</Table.Cell
					>
					<Table.Cell class="text-text-light dark:text-text-dark"
						>{instance.InstanceType}</Table.Cell
					>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.State}</Table.Cell>
					<Table.Cell class="text-right flex items-center justify-end space-x-2">
						<button
							disabled={instance.State != Ec2State.STOPPED}
							on:click={async () => {
								instance.State = await startInstance(instance.Id || '');
								toast.success('EC2 instance successfullly started');
							}}
							class="text-green-500 dark:text-green-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<Play size={25} />
						</button>

						<button
							disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
							on:click={async () => {
								instance.State = await stopInstance(instance.Id || '');
								toast.success('EC2 instance successfullly stopped');
							}}
							class="text-red-500 dark:text-red-500 disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<Square size={25} />
						</button>

						<button
							disabled={instance.State != Ec2State.RUNNING && instance.State != Ec2State.PENDING}
							on:click={async () => {
								instance.State = await rebootInstance(instance.Id || '');
								toast.success('EC2 instance successfullly rebooted');
							}}
							class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark"
						>
							<RotateCw size={25} />
						</button>

						<button
							on:click={async () => await terminateEC2(instance.Id || '')}
							class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark hover:text-red-600 dark:hover:text-red-600"
						>
							<Trash2 size={25} />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Toaster />
</div>
