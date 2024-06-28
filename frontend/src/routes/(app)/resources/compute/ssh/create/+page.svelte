<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import AccessType from '$lib/components/ssh/AccessType.svelte';
	import KeyFileFormat from '$lib/components/ssh/KeyFileFormat.svelte';
	import TypeRadio from '$lib/components/ssh/TypeRadio.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { CircleCheckIcon, CircleX } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';
	import { checkKeyNameAvailability } from '../../../../../../global/ssh-utils';

	export let form: ActionData;

	let validKeyName = false;
	let keyName = '';
	let keyPairTypeValue: string;
	let keyFileFormatValue: string;
	let keyAccessTypeValue: string;
	let submitDisabled = true;
	let nameTimeout: string | number | NodeJS.Timeout | undefined;

	function handleNameInput() {
		keyName = keyName.replace(' ', '-');
		keyName = keyName.replace(/[^a-zA-Z0-9-.]/g, '');
	}

	$: submitDisabled = !validKeyName;

	function handleFormData(formData: FormData) {
		formData.append('keyName', keyName);
		formData.append('keyPairType', keyPairTypeValue);
		formData.append('keyFileFormat', keyFileFormatValue);
		formData.append('keyAccessType', keyAccessTypeValue);
		return formData;
	}

	function validateKeyName() {
		validKeyName = false;

		clearTimeout(nameTimeout);
		nameTimeout = setTimeout(async () => {
			validKeyName = await checkKeyNameAvailability(keyName);
		}, 300);
	}
</script>

<svelte:head>
	<title>Create SSH key</title>
</svelte:head>

<div class="w-full flex flex-col items-center pb-20">
	<div class="min-w-[600px] w-fit flex flex-col items-start justify-center">
		<PageTitle title="Create a new SSH key" />

		<form
			method="POST"
			action="?/createKey"
			use:enhance={({ formData }) => {
				handleFormData(formData);

				return async ({ result }) => {
					await applyAction(result);

					if (form) {
						if (form.success) {
							toast.success('SSH key created successfully');
							goto('/resources/compute/ssh');
							return;
						} else {
							toast.error('Failed to create SSH key');
						}
					}
				};
			}}
			class="flex flex-col space-y-12 mt-12"
		>
			<div>
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Key Name
				</h1>
				<Input
					type="text"
					placeholder="Key name"
					bind:value={keyName}
					on:input={() => {
						handleNameInput();
						validateKeyName();
					}}
					class="w-[350px]"
				/>

				<div class="flex items-center text-sm space-x-1 mt-1">
					{#if validKeyName}
						<CircleCheckIcon size="12" class="text-green-600 dark:text-green-600" />
						<p class="text-green-600 dark:text-green-600">Valid key name</p>
					{:else}
						<CircleX size="12" class="text-text2-light dark:text-text2-dark" />
						<p class="text-text2-light dark:text-text2-dark">Invalid key name</p>
					{/if}
				</div>
			</div>

			<div>
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Key Pair Type
				</h1>

				<TypeRadio bind:value={keyPairTypeValue} />
			</div>

			<div>
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Private Key File Format
				</h1>

				<KeyFileFormat bind:value={keyFileFormatValue} />
			</div>

			<div>
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Key Access Type
				</h1>

				<AccessType bind:value={keyAccessTypeValue} />
			</div>

			<Button type="submit" disabled={submitDisabled} class="self-start">Create</Button>
		</form>
	</div>
</div>
