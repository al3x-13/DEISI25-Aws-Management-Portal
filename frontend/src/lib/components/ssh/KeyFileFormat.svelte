<script lang="ts">
	export let value = '.pem';
</script>

<div class="flex flex-col space-y-4">
	<button
		on:click|preventDefault={() => (value = '.pem')}
		class={value === '.pem'
			? 'min-w-[450px] max-w-[650px] w-full flex flex-col border-2 border-color-primary-light dark:border-color-primary-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex flex-col border-2 border-border-light dark:border-border-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div class="w-full flex items-center justify-between">
			<div class="flex items-center justify-center space-x-8">
				<p class="text-lg font-semibold">.pem</p>
				<p class="text-center text-md text-color-primary-light dark:text-color-primary-dark">
					Recommended
				</p>
			</div>

			<div
				class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
			>
				<div
					class={value === '.pem'
						? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
						: 'w-[8px] h-[8px] rounded-full bg-transparent'}
				></div>
			</div>
		</div>

		<p class="text-start text-sm mt-2">Compatible with OpenSSH</p>
	</button>

	<button
		on:click|preventDefault={() => (value = '.ppk')}
		class={value === '.ppk'
			? 'min-w-[450px] max-w-[650px] w-full flex flex-col border-2 border-color-primary-light dark:border-color-primary-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex flex-col border-2 border-border-light dark:border-border-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div class="w-full flex items-center justify-between">
			<p class="text-lg font-semibold">.ppk</p>

			<div
				class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
			>
				<div
					class={value === '.ppk'
						? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
						: 'w-[8px] h-[8px] rounded-full bg-transparent'}
				></div>
			</div>
		</div>

		<p class="text-start text-sm mt-2">Compatible with PuTTY</p>
	</button>
</div>
