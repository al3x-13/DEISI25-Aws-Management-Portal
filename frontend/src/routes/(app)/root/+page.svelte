<script lang="ts">
    import PageTitle from '$lib/assets/PageTitle.svelte';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center">
	<PageTitle
		title="Users"
	/>

	<Table.Root class="mt-4 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Username</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Email</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			
		</Table.Body>
	</Table.Root>


    <div class="mt-20 w-full flex justify-center">
        <PageTitle
            title="Pending User Requests"
        />
    </div>

    <Table.Root class="mt-4 text-base text-text-light dark:text-text-dark">
		<Table.Header>
			<Table.Row class="border-border-light dark:border-border-dark">
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Username</Table.Head>
				<Table.Head class="text-color-primary-light dark:text-color-primary-dark">Email</Table.Head>
                <Table.Head class="text-color-primary-light dark:text-color-primary-dark">Action</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			
		</Table.Body>
	</Table.Root>
</div>
