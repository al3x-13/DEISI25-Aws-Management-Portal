<script lang="ts">
	export let value = 'user';
</script>

<div class="flex flex-col space-y-4">
	<button
		on:click|preventDefault={() => (value = 'user')}
		class={value === 'user'
			? 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div
			class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
		>
			<div
				class={value === 'user'
					? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
					: 'w-[8px] h-[8px] rounded-full bg-transparent'}
			></div>
		</div>

		<div class="w-full flex flex-col items-start justify-start ml-8">
			<div class="w-full flex items-center justify-between space-x-8">
				<p class="text-lg font-semibold">User</p>
				<p class="text-center text-md text-color-primary-light dark:text-color-primary-dark">
					Default
				</p>
			</div>

			<p class="text-start text-sm">Default user role. Basic resource management.</p>
		</div>
	</button>

	<button
		on:click|preventDefault={() => (value = 'admin')}
		class={value === 'admin'
			? 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'
			: 'min-w-[450px] max-w-[650px] w-full flex items-center justify-center text-text-light dark:text-text-dark px-5 py-3'}
	>
		<div
			class="flex items-center justify-center p-[3px] rounded-full outline outline-2 outline-border-light dark:outline-border-dark"
		>
			<div
				class={value === 'admin'
					? 'w-[8px] h-[8px] rounded-full bg-color-primary-light dark:bg-color-primary-dark'
					: 'w-[8px] h-[8px] rounded-full bg-transparent'}
			></div>
		</div>

		<div class="w-full flex flex-col items-start justify-start ml-8">
			<p class="text-lg font-semibold">Admin</p>
			<p class="text-start text-sm">
				User with elevated privileges. Can manage both resources and users.
			</p>
		</div>
	</button>
</div>
