<script lang="ts">
	export let value: string = 'RSA';
</script>

<div class="flex space-x-8">
	<button
		on:click|preventDefault={() => (value = 'RSA')}
		class={value === 'RSA'
			? 'w-64 h-36 flex flex-col border-2 border-color-primary-light dark:border-color-primary-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'
			: 'w-64 h-36 flex flex-col border-2 border-border-light dark:border-border-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'}
	>
		<p class="text-lg font-semibold">RSA</p>
		<div class="w-full h-0.5 bg-border-light dark:bg-border-dark rounded-full my-1"></div>
		<p class="text-start text-sm">RSA encrypted private and public key pair</p>

		<div class="w-full flex items-center justify-between mr-1">
			<p class="text-color-primary-light dark:text-color-primary-dark mt-3">Recommended</p>
			<div
				class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
			>
				<div
					class={value === 'RSA'
						? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
						: 'w-[8px] h-[8px] rounded-full bg-transparent'}
				></div>
			</div>
		</div>
	</button>

	<button
		on:click|preventDefault={() => (value = 'ED25519')}
		class={value === 'ED25519'
			? 'w-64 h-36 flex flex-col border-2 border-color-primary-light dark:border-color-primary-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'
			: 'w-64 h-36 flex flex-col border-2 border-border-light dark:border-border-dark rounded-custom text-text-light dark:text-text-dark px-5 py-3'}
	>
		<p class="text-lg font-semibold">ED25519</p>
		<div class="w-full h-0.5 bg-border-light dark:bg-border-dark rounded-full my-1"></div>
		<p class="text-start text-sm">ED25519 encrypted private and public key pair</p>

		<div class="w-full h-full flex items-center justify-end mr-1">
			<div
				class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
			>
				<div
					class={value === 'ED25519'
						? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
						: 'w-[8px] h-[8px] rounded-full bg-transparent'}
				></div>
			</div>
		</div>
	</button>
</div>
