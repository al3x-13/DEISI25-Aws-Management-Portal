<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ec2Instances,
		getInstances,
		terminateInstance
	} from '../../../../../global/ec2-instances';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';

	export let data: PageData;

	let instances = data.instances;

	async function terminateEC2(id: string) {
		if (await terminateInstance(id)) {
			toast.success('EC2 instance deleted successfullly');
		} else {
			toast.error('Failed to terminate EC2 instance');
		}
		instances = getInstances();
	}
</script>

<div class="w-full flex flex-col items-center jusify-center">
	<PageTitleWithButton
		title="EC2 Instances"
		buttonText="+ New"
		buttonHref="/resources/compute/ec2/create"
	/>

	<Table.Root class="mt-12 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[120px]">ID</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Instance Type</Table.Head>
				<Table.Head class="text-right" />
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each instances as instance}
				<Table.Row>
					<Table.Cell class="font-bold text-color-primary-light dark:text-color-primary-dark"
						>{instance.id}</Table.Cell
					>
					<Table.Cell>{instance.name}</Table.Cell>
					<Table.Cell>{instance.instanceType}</Table.Cell>
					<Table.Cell class="text-right">
						<Button variant="destructive" on:click={async () => await terminateEC2(instance.id)}
							>Delete</Button
						>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Toaster />
</div>
