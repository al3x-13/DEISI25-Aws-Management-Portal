<script lang="ts">
	export let value = 'private';
</script>

<div class="flex flex-col space-y-4">
	<button
		on:click|preventDefault={() => (value = 'private')}
		class={value === '.pem'
			? 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div
			class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
		>
			<div
				class={value === 'private'
					? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
					: 'w-[8px] h-[8px] rounded-full bg-transparent'}
			></div>
		</div>

		<div class="w-full flex flex-col items-start justify-start ml-8">
			<div class="w-full flex items-center justify-between space-x-8">
				<p class="text-lg font-semibold">Private</p>
				<p class="text-center text-md text-color-primary-light dark:text-color-primary-dark">
					Recommended
				</p>
			</div>

			<p class="text-start text-sm">Only visible and accessible by me.</p>
		</div>
	</button>

	<button
		on:click|preventDefault={() => (value = 'public')}
		class={value === 'public'
			? 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div
			class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
		>
			<div
				class={value === 'public'
					? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
					: 'w-[8px] h-[8px] rounded-full bg-transparent'}
			></div>
		</div>

		<div class="w-full flex flex-col items-start justify-start ml-8">
			<p class="text-lg font-semibold">Public</p>
			<p class="text-start text-sm">
				Visible and accessible by anyone with access to the platform.
			</p>
		</div>
	</button>
</div>
