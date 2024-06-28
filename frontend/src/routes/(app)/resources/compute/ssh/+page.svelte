<script lang="ts">
	import PageTitleWithButton from '$lib/assets/PageTitleWithButton.svelte';
	import { SSHKeyAccessType, type SSHKey } from '@deisi25/types/lib/resources/ssh/ssh';
	import type { PageData } from './$types';
	import { Eye, FileKey2, FileLock2, Clipboard, Trash2 } from 'lucide-svelte';
	import {
		updateKeyAccessType,
		deleteKey,
		getSSHKeysClientside
	} from '../../../../../global/ssh-utils';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	let keys: SSHKey[] = data.keys;

	async function updateKeyVisibility(keyName: string, visibility: SSHKeyAccessType) {
		const success = await updateKeyAccessType(keyName, visibility);
		if (success) {
			toast.success('Key visibility updated successfullly');
		} else {
			toast.error('Failed to update key visibility');
		}
	}

	async function handleDeleteKey(keyName: string) {
		const success = await deleteKey(keyName);
		if (success) {
			toast.success('Key deleted successfullly');
		} else {
			toast.error('Failed to delete key');
		}
	}

	async function updateKeysData() {
		keys = await getSSHKeysClientside();
	}
</script>

<div class="w-full max-w-5xl flex flex-col items-center jusify-center">
	<PageTitleWithButton
		title="SSH Keys"
		buttonText="+ New"
		buttonHref="/resources/compute/ssh/create"
	/>

	<div class="w-full h-full flex flex-col items-center justify-center">
		{#if keys.length === 0}
			<p class="text-3xl font-semibold text-text-light dark:text-text-dark my-20">
				No keys to display
			</p>
		{/if}

		{#each keys as key}
			<div
				class="w-[650px] flex items-center justify-between border-2 border-border-light dark:border-border-dark rounded-custom text-text-light dark:text-text-dark px-4 py-2 mt-20 mb-10"
			>
				<div class="w-fit flex flex-col">
					<p
						class="text-xl font-semibold text-color-primary-light dark:text-color-primary-dark mb-2"
					>
						{key.Name}
					</p>

					<div class="flex items-center space-x-2 mb-1">
						<FileLock2 size={22} />
						<p>{key.KeyPairType.toUpperCase()}</p>
					</div>

					<div class="flex items-center space-x-2 mb-1">
						<FileKey2 size={22} />
						<p>{key.PrivateKeyFileFormat}</p>
					</div>

					<div class="flex items-center space-x-2 mb-1">
						<Eye size={22} />
						<p>{key.KeyAccessType}</p>
					</div>
				</div>

				<div class="flex flex-col items-start justify-center space-y-2 pr-2">
					<button
						on:click={async () => {
							await updateKeyVisibility(
								key.Name,
								key.KeyAccessType === 'private' ? SSHKeyAccessType.Public : SSHKeyAccessType.Private
							);
							updateKeysData();
						}}
						class="w-full flex items-center space-x-3 hover:text-color-primary-light dark:hover:text-color-primary-dark"
					>
						<Eye size={26} />
						<p>Make {key.KeyAccessType === 'private' ? 'public' : 'private'}</p>
					</button>

					<button
						on:click={() => {
							navigator.clipboard
								.writeText(key.PrivateKeyValue)
								.then(function () {
									toast.success('Private key copied to clipboard');
								})
								.catch(function (err) {
									toast.error('Failed to copy key to clipboard');
									console.log('Failed to copy key to clipboard: ' + err);
								});
						}}
						class="w-full flex items-center space-x-3 hover:text-color-primary-light dark:hover:text-color-primary-dark"
					>
						<Clipboard size={26} />
						<p>Copy to clipboard</p>
					</button>

					<button
						on:click={async () => {
							await handleDeleteKey(key.Name);
							updateKeysData();
						}}
						class="w-full flex items-center space-x-3 hover:text-red-600 dark:hover:text-red-600"
					>
						<Trash2 size={26} />
						<p>Delete</p>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
