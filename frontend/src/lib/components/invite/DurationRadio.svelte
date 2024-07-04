<script lang="ts">
	export let value = 4;

	const durationOptions = [
		{ text: '4 Hours', durationInHours: 4 },
		{ text: '8 Hours', durationInHours: 8 },
		{ text: '12 Hours', durationInHours: 12 },
		{ text: '24 Hours', durationInHours: 24 },
		{ text: '48 Hours', durationInHours: 48 },
		{ text: '1 Week', durationInHours: 168 }
	];
</script>

<div class="flex flex-col space-y-1">
	{#each durationOptions as option}
		<button
			on:click|preventDefault={() => (value = option.durationInHours)}
			class={value === option.durationInHours
				? 'flex items-center justify-start text-text-light dark:text-text-dark px-5 py-3'
				: 'flex items-center justify-start text-text-light dark:text-text-dark px-5 py-3'}
		>
			<div
				class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
			>
				<div
					class={value === option.durationInHours
						? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
						: 'w-[8px] h-[8px] rounded-full bg-transparent'}
				></div>
			</div>

			<p class="text-lg font-semibold ml-6">{option.text}</p>
		</button>
	{/each}
</div>
