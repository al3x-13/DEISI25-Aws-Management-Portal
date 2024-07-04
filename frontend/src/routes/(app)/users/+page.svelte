<script lang="ts">
	import type { UserNoHash } from '@deisi25/types/lib/users/users';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { Trash2 } from 'lucide-svelte';
	import { deleteUser, getAllUsers } from '../../../global/user-utils';
	import { toast } from 'svelte-sonner';
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';

	export let data: PageData;
	let users: UserNoHash[] = data.users;

	async function handleUserDelete(id: number) {
		const success = await deleteUser(id);
		if (success) {
			toast.success('User deleted successfullly');
		} else {
			toast.error('Failed to delete user');
		}
	}

	async function updateUsers() {
		users = await getAllUsers();
	}
</script>

<div class="w-full h-full max-w-6xl flex flex-col items-center jusify-center pt-10">
	<PageTitleWithButton title="Users" buttonText="+ New invite" buttonHref="/users/invite" />

	<div class="w-full h-full flex flex-col items-center justify-center">
		{#if users.length === 0}
			<p class="text-3xl font-semibold text-text-light dark:text-text-dark my-20">
				No keys to display
			</p>
		{/if}

		{#if users.length > 1}
			<Table.Root class="mt-20 text-base text-text-light dark:text-text-dark">
				<Table.Header>
					<Table.Row class="border-border-light dark:border-border-dark">
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							ID
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Username
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Email
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Role
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Created at
						</Table.Head>
						<Table.Head class="text-right text-color-primary-light dark:text-color-primary-dark">
							Actions
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each users as user}
						<Table.Row class="border-border-light dark:border-border-dark">
							<Table.Cell class="text-text-light dark:text-text-dark">
								{user.id}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{user.username}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{user.email}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{user.role}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{user.createdAt}
							</Table.Cell>

							<Table.Cell class="text-right text-text-light dark:text-text-dark">
								<button
									on:click={async () => {
										handleUserDelete(user.id);
										updateUsers();
									}}
									class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark hover:text-red-600 dark:hover:text-red-600"
								>
									<Trash2 size={25} />
								</button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
