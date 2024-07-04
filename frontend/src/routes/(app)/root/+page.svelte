<script lang="ts">
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';
	import { getAllUsers } from '../../../global/user-utils';
	import type { UserNoHash } from '@deisi25/types/lib/users/users';
	import type { UserInvite } from '@deisi25/types/lib/invites/invites';
	import { CircleCheckIcon, CircleXIcon } from 'lucide-svelte';
	import { getAllUserInvitesClientside } from '../../../global/invite-utils';

	let users: UserNoHash[] = [];
	let invites: UserInvite[] = [];

	onMount(async () => {
		users = await getAllUsers();
		invites = await getAllUserInvitesClientside();
	});
</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center pt-20">
	<PageTitle title="Users" />

	<div class="w-full h-full flex flex-col items-center justify-center">
		{#if users.length === 0}
			<p class="text-3xl font-semibold text-text-light dark:text-text-dark my-20">
				No users to display
			</p>
		{/if}

		{#if users.length > 1}
			<Table.Root class="mt-6 text-base text-text-light dark:text-text-dark">
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
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>

	<div class="mt-20 w-full flex justify-center">
		<PageTitle title="Pending User Requests" />
	</div>

	<div class="w-full h-full flex flex-col items-center justify-center">
		{#if invites.length === 0}
			<p class="text-3xl font-semibold text-text-light dark:text-text-dark my-8">
				No invites to display
			</p>
		{/if}

		{#if invites.length > 1}
			<Table.Root class="mt-8 text-base text-text-light dark:text-text-dark">
				<Table.Header>
					<Table.Row class="border-border-light dark:border-border-dark">
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							UUID
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Role
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Created by
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Expires at
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Used
						</Table.Head>
						<Table.Head class="text-color-primary-light dark:text-color-primary-dark">
							Valid
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each invites as inv}
						<Table.Row class="border-border-light dark:border-border-dark">
							<Table.Cell class="text-text-light dark:text-text-dark">
								{inv.uuid}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{inv.role}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{inv.createdBy}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{new Date(inv.expiresAt).toUTCString()}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{inv.used ? 'Yes' : 'No'}
							</Table.Cell>

							<Table.Cell class="text-text-light dark:text-text-dark">
								{#if inv.isValid}
									<CircleCheckIcon size={26} class="text-green-500" />
								{:else}
									<CircleXIcon size={26} />
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
