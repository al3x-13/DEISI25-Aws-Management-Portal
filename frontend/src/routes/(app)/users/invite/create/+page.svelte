<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import DurationRadio from '$lib/components/invite/DurationRadio.svelte';
	import RoleRadio from '$lib/components/invite/RoleRadio.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	export let form: ActionData;

	let roleNameValue = 'user';
	let durationInHoursValue = 4;

	function handleFormData(formData: FormData) {
		formData.append('roleName', roleNameValue);
		formData.append('duration', durationInHoursValue.toString());
		return formData;
	}
</script>

<div class="max-w-5xl w-full mt-16">
	<PageTitle title="Create User Invite" />

	<form
		method="POST"
		action="?/createInvite"
		use:enhance={({ formData }) => {
			handleFormData(formData);

			return async ({ result }) => {
				await applyAction(result);

				if (form) {
					if (form.success) {
						toast.success('User invite created successfully');
						goto('/users/invite');
						return;
					} else {
						toast.error('Failed to create user invite');
					}
				}
			};
		}}
		class="w-full flex flex-col items-center justify-center"
	>
		<div class="w-full flex items-start justify-around mt-14">
			<div>
				<p class="text-2xl text-text-light dark:text-text-dark mb-8">User Role</p>
				<RoleRadio bind:value={roleNameValue} />
			</div>

			<div>
				<p class="text-2xl text-text-light dark:text-text-dark mb-8">Invite Duration</p>
				<div class="w-full mx-4">
					<DurationRadio bind:value={durationInHoursValue} />
				</div>
			</div>
		</div>

		<Button type="submit" class="mt-14">Create Invite</Button>
	</form>
</div>
