<script lang="ts">
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let formSuccess: ActionData;

	const amis = [
		{ value: 'ami-0500f74cc2b89fb6b', label: 'Amazon Linux 2023 AMI (ami-0500f74cc2b89fb6b)' },
		{ value: 'ami-017f2d474b502e78a', label: 'Amazon Linux 2 AMI (HVM) (ami-017f2d474b502e78a)' }
	];
	const instanceTypes = [{ value: 't2.micro', label: 't2.micro' }];
	const volumeTypes = [
		{ value: 'gp3', label: 'General Purpose SSD (gp3)' },
		{ value: 'gp2', label: 'General Purpose SSD (gp2)' },
		{ value: 'io1', label: 'Provisioned IOPS SSD (io1)' },
		{ value: 'io2', label: 'Provisioned IOPS SSD (io2)' },
		{ value: 'standard', label: 'Magnetic (standard)' }
	];

	let nameValue = '';
	let amiValue = amis.at(0);
	let instanceTypeValue = instanceTypes.at(0);
	let volumeTypeValue = volumeTypes.at(0);
	let submitDisabled = true;

	$: {
		if (nameValue.length === 0) {
			submitDisabled = true;
		} else {
			submitDisabled = false;
		}
	}
</script>

<div class="w-full flex flex-col items-start justify-center space-y-12">
	<PageTitle title="New EC2 Instance" />

	<form method="POST" action="?/createInstance" class="flex flex-col space-y-12">
		<div>
			<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
				Instance Name
			</h1>
			<input
				type="text"
				bind:value={nameValue}
				name="name"
				placeholder="Web Server"
				class="w-[350px] text-base text-text-light dark:text-text-dark bg-transparent border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark outline-none placeholder:text-details-light dark:placeholder:text-details-dark px-2 py-1"
			/>
		</div>

		<div>
			<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
				OS Image (Amazon Machine Images)
			</h1>

			<h2 class="text-lg font text-text-light dark:text-text-dark mb-3">Base OS</h2>
			<div
				class="size-32 p-4 flex flex-col items-center justify-between rounded-custom border-[3px] border-color-primary-light dark:border-color-primary-dark bg-bg2-light dark:bg-bg2-dark cursor-pointer"
			>
				<p class="text-sm text-center font-bold text-text-light dark:text-text-dark select-none">
					Amazon Linux
				</p>
				<img src="/os-images/amazon-linux.png" alt="amazon-linux-logo" />
			</div>

			<h2 class="text-lg font text-text-light dark:text-text-dark mb-3 mt-6">
				Amazon Machine Image (AMI)
			</h2>

			<Select.Root portal={null} name="ami" bind:selected={amiValue}>
				<Select.Trigger
					class="w-[450px] text-base text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark"
				>
					<Select.Value placeholder="Select AMI" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each amis as ami}
							<Select.Item value={ami.value} label={ami.label} class="">{ami.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="ami" />
			</Select.Root>
		</div>

		<div>
			<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
				Instance Type
			</h1>
			<Select.Root portal={null} name="instanceType" bind:selected={instanceTypeValue}>
				<Select.Trigger
					class="w-[250px] text-base text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark"
				>
					<Select.Value placeholder="Select an instance type" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each instanceTypes as instance}
							<Select.Item value={instance.value} label={instance.label} class=""
								>{instance.label}</Select.Item
							>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="instanceType" />
			</Select.Root>
		</div>

		<div>
			<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
				Storage
			</h1>

			<div class="flex items-center justify-center space-x-10">
				<div class="flex items-center justiyf-center">
					<Select.Root portal={null} name="storageType" bind:selected={volumeTypeValue}>
						<Select.Trigger
							id="storage"
							class="w-[300px] text-base text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark"
						>
							<Select.Value placeholder="Select volume" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each volumeTypes as volume}
									<Select.Item value={volume.value} label={volume.label} class=""
										>{volume.label}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="storageType" />
					</Select.Root>
					<label for="storage" class="ml-3 text-text-light dark:text-text-dark">
						Root Volume Type
					</label>
				</div>

				<div class="flex items-center justiyf-center">
					<input
						id="storage"
						name="storageSize"
						type="number"
						min="1"
						max="10000"
						value="8"
						class="bg-transparent text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark focus:border-color-primary-light dark:focus:border-color-primary-dark py-1 px-2"
					/>
					<label for="storage" class="ml-3 text-text-light dark:text-text-dark">GiB</label>
				</div>
			</div>
		</div>

		<Button type="submit" disabled={submitDisabled} class="self-start">Create</Button>
	</form>
</div>
