<script lang="ts">
	import type { Ec2Image } from '@deisi25/types';
	import { Button } from '../ui/button';

	export let isOpen = false;
	export let amis: Ec2Image[];
	export let selected: Ec2Image | null;

	let dialog: HTMLDialogElement;
	let validAmiInsertion: boolean = false;

	$: if (dialog && isOpen) dialog.showModal();

	function closeModal() {
		validAmiInsertion = false;
		dialog.close();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (isOpen = false)}
	on:click|self={() => closeModal()}
	class="min-w-[500px] max-w-2xl max-h-[650px] bg-bg-light dark:bg-bg-dark p-4 rounded-custom overflow-auto space-y-3"
>
	<h1 class="text-xl text-text-light dark:text-text-dark mb-3">Select an Image</h1>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#each amis as ami}
		<div
			on:click|stopPropagation|preventDefault
			class="w-full flex flex-col items-start justify-start border-2 border-border-light dark:border-border-dark rounded-custom p-2 text-text-light dark:text-text-dark"
		>
			<div class="w-full flex justify-between space-x-4">
				<div>
					<p class="text-lg font-semibold">{ami.Name}</p>
					<p>{ami.ImageId}</p>
					<p>Architecture: {ami.Architecture}</p>
					<p>Virtualization: {ami.VirtualizationType}</p>
					{#if ami.FreeTier}
						<p class="text-nowrap text-color-primary-light dark:text-color-primary-dark">
							Free tier
						</p>
					{/if}
				</div>
				<Button
					type="submit"
					class="self-center"
					on:click={() => {
						selected = ami;
						closeModal();
					}}
				>
					Select
				</Button>
			</div>
		</div>
	{/each}
</dialog>

<style>
	dialog::backdrop {
		@apply bg-black bg-opacity-70;
	}
</style>
