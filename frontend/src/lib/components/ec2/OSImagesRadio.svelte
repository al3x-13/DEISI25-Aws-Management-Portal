<script lang="ts">
	import { Ec2ImageBaseOs } from '@deisi25/types';
	import { createEventDispatcher } from 'svelte';

	let selectedOs: Ec2ImageBaseOs;

	let options = [
		{ id: Ec2ImageBaseOs.AmazonLinux, name: 'Amazon Linux', img: 'amazon-linux.png' },
		{ id: Ec2ImageBaseOs.MacOS, name: 'macOS', img: 'macos.png' },
		{ id: Ec2ImageBaseOs.Ubuntu, name: 'Ubuntu', img: 'ubuntu.png' },
		{ id: Ec2ImageBaseOs.Windows, name: 'Windows', img: 'windows.png' },
		{ id: Ec2ImageBaseOs.RedHat, name: 'Red Hat', img: 'redhat.png' },
		{ id: Ec2ImageBaseOs.SuseLinux, name: 'SUSE Linux', img: 'suse.png' },
		{ id: Ec2ImageBaseOs.Debian, name: 'Debian Linux', img: 'debian.png' }
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
			value={os.id}
			class="hidden"
		/>
		<label for={os.id}>
			<div
				class="size-32 p-4 flex flex-col items-center justify-between rounded-custom border-[2px] bg-bg2-light dark:bg-bg2-dark cursor-pointer {selectedOs ===
				os.id
					? 'border-color-primary-light dark:border-color-primary-dark'
					: 'border-border-light dark:border-border-dark'}"
			>
				<p
					class="text-sm text-center font-bold select-none {selectedOs !== os.id
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
