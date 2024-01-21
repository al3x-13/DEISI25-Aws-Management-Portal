<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ec2Instances,
		getInstances,
		terminateInstance,
		type OutInstance
	} from '../../../../../global/ec2-instances';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Trash2 } from 'lucide-svelte';

	export let data: PageData;

	let instances: OutInstance[] = data.instances || [];

	async function terminateEC2(id: string) {
		if (await terminateInstance(id)) {
			toast.success('EC2 instance deleted successfullly');
			window.location.reload();
		} else {
			toast.error('Failed to terminate EC2 instance');
		}
	}
</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center">
	<PageTitleWithButton
		title="EC2 Instances"
		buttonText="+ New"
		buttonHref="/resources/compute/ec2/create"
	/>

	<Table.Root class="mt-12 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">ID</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Name</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark"
					>Instance Type</Table.Head
				>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">State</Table.Head>
				<Table.Head class="text-right" />
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each instances as instance}
				<Table.Row>
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
					<Table.Cell class="text-right">
						<button on:click={async () => await terminateEC2(instance.Id || '')}>
							<Trash2 size={30} class="text-red-700" />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Toaster />
</div>
