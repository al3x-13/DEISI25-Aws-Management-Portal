<script lang="ts">
	import PageTitle from '$lib/assets/PageTitle.svelte';
</script>

<div class="w-full flex flex-col items-start justify-center space-y-12">
	<PageTitle title="New EC2 Instance" />

	<div>
		<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
			Instance Name
		</h1>
		<input
			type="text"
			placeholder="Web Server"
			class="w-[350px] text-lg text-text-light dark:text-text-dark bg-transparent border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark outline-none placeholder:text-details-light dark:placeholder:text-details-dark px-2 py-1"
		/>
	</div>

	<div>
		<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
			OS Image (Amazon Machine Images)
		</h1>

		<h2 class="text-lg font text-color-primary-light dark:text-color-primary-dark mb-3">Base OS</h2>
		<div
			class="size-32 p-4 flex flex-col items-center justify-between rounded-custom border-[3px] border-color-primary-light dark:border-color-primary-dark bg-bg2-light dark:bg-bg2-dark"
		>
			<p class="text-sm text-center font-bold text-text-light dark:text-text-dark">Amazon Linux</p>
			<img src="/os-images/amazon-linux.png" alt="amazon-linux-logo" />
		</div>

		<h2 class="text-lg font text-color-primary-light dark:text-color-primary-dark mb-3 mt-6">
			Amazon Machine Image (AMI)
		</h2>
		<select
			name="ami"
			class="w-[450px] bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark outline-none px-2 py-1"
		>
			<option
				value="Test"
				selected
				class="dark:bg-bg-dark text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark outline-none"
				>Amazon Linux 2023 AMI</option
			>
			<option value="Test2">Test2</option>
			<option value="Test2">Test3</option>
		</select>
	</div>
</div>
