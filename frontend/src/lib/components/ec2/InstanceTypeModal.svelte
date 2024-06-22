<script lang="ts">
	import type { Ec2InstanceType } from '@deisi25/types';
	import { Button } from '../ui/button';
	import { BarLoader, DoubleBounce, ScaleOut } from 'svelte-loading-spinners';

	export let isOpen = false;
	export let instanceTypes: Ec2InstanceType[] | null;
	export let selected: Ec2InstanceType | null;

	let dialog: HTMLDialogElement;
	let validInstanceTypeInsertion: boolean = false;

	$: if (dialog && isOpen) dialog.showModal();

	function closeModal() {
		validInstanceTypeInsertion = false;
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
	{#if instanceTypes !== null}
		{#each instanceTypes as iType}
			<div
				on:click|stopPropagation|preventDefault
				class="w-full flex flex-col items-start justify-start border-2 border-border-light dark:border-border-dark rounded-custom p-2 text-text-light dark:text-text-dark"
			>
				<div class="w-full flex justify-between space-x-4">
					<div>
						<p class="text-lg font-semibold">{iType.InstanceType}</p>
						{#if iType.FreeTier}
							<p class="text-nowrap text-color-primary-light dark:text-color-primary-dark">
								Free tier
							</p>
						{/if}
					</div>
					<Button
						type="submit"
						class="self-center"
						on:click={() => {
							selected = iType;
							closeModal();
						}}
					>
						Select
					</Button>
				</div>
			</div>
		{/each}
	{:else}
		<div class="w-full flex items-center justify-center py-20">
			<BarLoader size="50" color="#0B79DE" unit="px" />
		</div>
	{/if}
</dialog>

<style>
	dialog::backdrop {
		@apply bg-black bg-opacity-70;
	}
</style>
