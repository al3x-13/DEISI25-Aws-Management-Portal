<script lang="ts">
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import AccessType from '$lib/components/ssh/AccessType.svelte';
	import KeyFileFormat from '$lib/components/ssh/KeyFileFormat.svelte';
	import TypeRadio from '$lib/components/ssh/TypeRadio.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { CircleCheckIcon, CircleX } from 'lucide-svelte';

	let validKeyName = false;
	let keyName = '';
	let keyPairTypeValue: string;
	let keyFileFormatValue: string;
	let keyAccessTypeValue: string;
	let submitDisabled = true;

	function handleNameInput() {
		keyName = keyName.replace(' ', '-');
		keyName = keyName.replace(/[^a-zA-Z0-9-.]/g, '');

		// TODO: validate name in server
		validKeyName = keyName.length > 0;
	}

	$: submitDisabled = !validKeyName;
</script>

<svelte:head>
	<title>Create SSH key</title>
</svelte:head>

<div class="w-full flex flex-col items-center pb-20">
	<div class="min-w-[600px] w-fit flex flex-col items-start justify-center">
		<PageTitle title="Create a new SSH key" />

		<form method="POST" action="" class="flex flex-col space-y-12 mt-12">
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
