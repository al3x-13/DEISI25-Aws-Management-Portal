<script lang="ts">
	import type { Ec2Instance } from '@deisi25/types';
	import type { PageData } from './$types';
	import type { SSHKey } from '@deisi25/types/lib/resources/ssh/ssh';
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	let instances: Ec2Instance[] = data.instances;
	let keys: SSHKey[] = data.keys;

</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center">
	<PageTitle
		title="EC2 Instances"
	/>

	<Table.Root class="mt-4 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Aws ID</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Name</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Tags</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">State</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
            {#each instances as instance}
				<Table.Row class="text-lg">
					<Table.Cell class="w-[300px] font-bold text-color-primary-light dark:text-color-primary-dark">{instance.AwsInstanceId}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.InstanceName}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.Tags}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{instance.State}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<div class="mt-20 w-full flex justify-center">
        <PageTitle
            title="SSH Keys"
        />
    </div>

	<Table.Root class="mt-4 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Name</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Pair Type</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Private File Format</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Access Type</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
            {#each keys as key}
				<Table.Row class="text-lg">
					<Table.Cell class="text-text-light dark:text-text-dark">{key.Name}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{key.KeyPairType}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{key.PrivateKeyFileFormat}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{key.KeyAccessType}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
