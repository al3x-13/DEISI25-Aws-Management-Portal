<script lang="ts">
    import PageTitle from '$lib/assets/PageTitle.svelte';
	import * as Table from '$lib/components/ui/table';
    import { onMount } from 'svelte';
    // import { listUsers } from "../../../global/user-instances"; // Waiting for merge from user-accounts-management

    interface User {
        id: number;
        username: string;
        email: string;
        role: string;
    }

    let users: User[] = []; 

    onMount(async () => {
		const userInfoList = await listUsers();
		
		users = userInfoList.map(userInfo => ({
			id: userInfo.id,
			username: userInfo.username,
			email: userInfo.email,
			role: userInfo.role,
		}));
    });
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
                <Table.Head class="text-color-primary-light dark:text-color-primary-dark">Role</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
            {#each users as user (user.id)}
				<Table.Row class="text-lg">
					<Table.Cell class="text-text-light dark:text-text-dark">{user.username}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{user.email}</Table.Cell>
					<Table.Cell class="text-text-light dark:text-text-dark">{user.role}</Table.Cell>
				</Table.Row>
			{/each}
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
