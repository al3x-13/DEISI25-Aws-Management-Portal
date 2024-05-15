<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let selectedOs: string = '';

	let options = [
		{ id: 'amazon', name: 'Amazon Linux', img: 'amazon-linux.png' },
		{ id: 'macos', name: 'macOS', img: 'macos.png' },
		{ id: 'ubuntu', name: 'Ubuntu', img: 'ubuntu.png' },
		{ id: 'windows', name: 'Windows', img: 'windows.png' },
		{ id: 'redhat', name: 'Red Hat', img: 'redhat.png' },
		{ id: 'suse', name: 'SUSE Linux', img: 'suse.png' },
		{ id: 'debian', name: 'Debian Linux', img: 'debian.png' }
	];

	const dispatch = createEventDispatcher();

	$: dispatch('change', selectedOs);
</script>

<div class="max-w-md overflow-x-auto overflow-y-hidden flex space-x-2 custom-scrollbar pb-1">
	{#each options as os}
		<input
			type="radio"
			id={os.id}
			name={os.name}
			bind:group={selectedOs}
			value={os.name}
			class="hidden"
		/>
		<label for={os.id}>
			<div
				class="size-32 p-4 flex flex-col items-center justify-between rounded-custom border-[2px] bg-bg2-light dark:bg-bg2-dark cursor-pointer {selectedOs ===
				os.name
					? 'border-color-primary-light dark:border-color-primary-dark'
					: 'border-border-light dark:border-border-dark'}"
			>
				<p
					class="text-sm text-center font-bold select-none {selectedOs !== os.name
						? 'text-text-light dark:text-text-dark'
						: 'text-color-primary-light dark:text-color-primary-dark'}"
				>
					{os.name}
				</p>
				<img src="/os-images/{os.img}" alt="{os.id}-logo" class="p-2" />
			</div>
		</label>
	{/each}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 5px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 30%);
		border-radius: 12px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #0b79de;
		border-radius: 12px;
	}
</style>
