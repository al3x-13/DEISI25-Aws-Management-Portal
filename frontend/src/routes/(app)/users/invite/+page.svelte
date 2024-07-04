<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import * as Table from '$lib/components/ui/table';
	import { CircleCheckIcon, CircleXIcon, MailXIcon } from 'lucide-svelte';
	import {
		deativateUserInviteClientside,
		getAllUserInvitesClientside
	} from '../../../../global/invite-utils';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	let invites = data.invites;

	async function deactivateInvite(uuid: string) {
		const success = await deativateUserInviteClientside(uuid);
		if (success) {
			toast.success('Invite deactivated successfully');
		} else {
			toast.error('Failed to deativate invite');
		}
		invites = await getAllUserInvitesClientside();
	}
</script>

<div class="w-full h-full max-w-6xl flex flex-col items-center jusify-center pt-10">
	<PageTitleWithButton
		title="User Invites"
		buttonText="+ New invite"
		buttonHref="/users/invite/create"
	/>

	<div class="w-full h-full flex flex-col items-center justify-center">
		{#if invites.length === 0}
			<p class="text-3xl font-semibold text-text-light dark:text-text-dark my-20">
				No invites to display
			</p>
		{/if}

		{#if invites.length > 1}
			<Table.Root class="mt-20 text-base text-text-light dark:text-text-dark">
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
						<Table.Head class="text-right text-color-primary-light dark:text-color-primary-dark">
							Actions
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

							<Table.Cell class="text-right text-text-light dark:text-text-dark">
								<button
									on:click={async () => {
										deactivateInvite(inv.uuid);
									}}
									class="text-text-light dark:text-text-dark disabled:text-bg2-light dark:disabled:text-bg2-dark hover:text-red-600 dark:hover:text-red-600"
								>
									<MailXIcon size={28} />
								</button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
