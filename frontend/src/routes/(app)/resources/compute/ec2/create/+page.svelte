<script lang="ts">
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import OsImagesRadio from '$lib/components/ec2/OSImagesRadio.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Ec2ImageBaseOs, type Ec2Image, type Ec2InstanceType } from '@deisi25/types';
	import {
		getEc2QuickstartImagesClientside,
		getEc2InstanceTypesClientside,
		validateEc2InstanceNameClientside
	} from '../../../../../../global/ec2-instances';
	import AmiModal from '$lib/components/ec2/AmiModal.svelte';
	import InstanceTypeModal from '$lib/components/ec2/InstanceTypeModal.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { CircleCheckIcon, CircleX } from 'lucide-svelte';

	export let form: ActionData;

	const volumeTypes = [
		{ value: 'gp3', label: 'General Purpose SSD (gp3)' },
		{ value: 'gp2', label: 'General Purpose SSD (gp2)' },
		{ value: 'io1', label: 'Provisioned IOPS SSD (io1)' },
		{ value: 'io2', label: 'Provisioned IOPS SSD (io2)' },
		{ value: 'standard', label: 'Magnetic (standard)' }
	];

	// instance values
	let nameValue = '';
	let validInstanceName = false;
	// eslint-disable-next-line no-undef
	let nameTimeout: string | number | NodeJS.Timeout | undefined;
	let volumeTypeValue = volumeTypes.at(0);
	let submitDisabled = true;
	let selectedOs: Ec2ImageBaseOs | null = null;
	let selectedAmi: Ec2Image | null = null;
	let selectedInstanceType: Ec2InstanceType | null = null;
	let storageSize = 8;

	// selection data
	let amis: Ec2Image[] = [];
	let instanceTypes: Ec2InstanceType[] | null = null;

	$: {
		submitDisabled = !validInstanceName || selectedAmi === null || selectedInstanceType === null;
	}

	function handleNameInput() {
		nameValue = nameValue.replace(' ', '-');
		nameValue = nameValue.replace(/[^a-zA-Z0-9-.]/g, '');
	}

	function validateInstanceName() {
		validInstanceName = false;

		clearTimeout(nameTimeout);
		nameTimeout = setTimeout(() => {
			validateEc2InstanceNameClientside(nameValue).then((valid) => {
				validInstanceName = valid;
			});
		}, 300);
	}

	async function fetchAmis() {
		if (selectedOs != null) {
			const images = await getEc2QuickstartImagesClientside(selectedOs);
			if (images == null) {
				toast.error('Failed to get EC2 images');
				return;
			}
			amis = images;
		}
	}

	async function fetchInstanceTypes() {
		instanceTypes = await getEc2InstanceTypesClientside();
		if (selectedInstanceType === null) {
			selectedInstanceType = instanceTypes[0];
		}
	}

	function handleFormData(formData: FormData) {
		formData.set('name', nameValue);
		formData.set('ami', selectedAmi!.ImageId);
		formData.set('instanceType', selectedInstanceType!.InstanceType);
		formData.set('storageType', volumeTypeValue!.value);
		formData.set('storageSize', storageSize.toString());
	}

	// Modals state
	let showAmiModal = false;
	let showInstanceTypeModal = false;

	onMount(async () => fetchInstanceTypes());

	onDestroy(() => {
		if (nameTimeout) {
			clearTimeout(nameTimeout);
		}
	});
</script>

<div class="w-full flex flex-col items-center">
	<div class="w-fit flex flex-col items-center justify-center">
		<PageTitle title="New EC2 Instance" />

		<form
			method="POST"
			action="?/createInstance"
			use:enhance={({ formData }) => {
				handleFormData(formData);

				return async ({ result, update }) => {
					await applyAction(result);

					if (form) {
						if (form.success) {
							toast.success('EC2 instance created successfully');
							goto('/resources/compute/ec2');
							return;
						} else {
							toast.error('Failed to create EC2 instance');
						}
					}

					await update();
				};
			}}
			class="flex flex-col items-center justify-center space-y-12 mt-12"
		>
			<div class="flex flex-row space-x-20">
				<div class="flex flex-col basis-1/2 space-y-12">
					<div>
						<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
							Instance Name
						</h1>
						<Input
							type="text"
							placeholder="Web Server"
							bind:value={nameValue}
							on:input={() => {
								handleNameInput();
								validateInstanceName();
							}}
							class="w-[350px]"
						/>
						<div class="flex items-center text-sm space-x-1 mt-1">
							{#if validInstanceName}
								<CircleCheckIcon size="12" class="text-green-600 dark:text-green-600" />
								<p class="text-green-600 dark:text-green-600">Valid instance name</p>
							{:else}
								<CircleX size="12" class="text-text2-light dark:text-text2-dark" />
								<p class="text-text2-light dark:text-text2-dark">Invalid instance name</p>
							{/if}
						</div>
					</div>

					<div>
						<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
							OS Image (Amazon Machine Images)
						</h1>

						<h2 class="text-lg font text-text-light dark:text-text-dark mb-3">Base OS</h2>

						<OsImagesRadio
							on:change={(e) => {
								selectedOs = e.detail;
								amis = [];
								fetchAmis();
							}}
						/>

						<h2 class="text-lg font text-text-light dark:text-text-dark mb-3 mt-6">
							Amazon Machine Image (AMI)
						</h2>

						<AmiModal bind:isOpen={showAmiModal} {amis} bind:selected={selectedAmi} />
						<div
							class="flex items-center justify-between text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark p-1 pl-3"
						>
							{#if selectedAmi === null}
								<p>AMI not selected</p>
							{:else}
								<p>{selectedAmi.ImageId}</p>
							{/if}

							<Button
								on:click={async () => {
									showAmiModal = true;
									fetchAmis();
								}}
								disabled={selectedOs === null}
							>
								Select AMI
							</Button>
						</div>

						{#if selectedOs === null}
							<p class="text-text2-light dark:text-text2-dark mt-1">Select Base OS first</p>
						{/if}
					</div>

					<div>
						<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
							Instance Type
						</h1>

						<InstanceTypeModal
							bind:isOpen={showInstanceTypeModal}
							{instanceTypes}
							bind:selected={selectedInstanceType}
						/>
						<div
							class="flex items-center justify-between text-text-light dark:text-text-dark border-2 rounded-custom border-border-light dark:border-border-dark p-1 pl-3"
						>
							{#if selectedInstanceType === null}
								<p>Instance not selected</p>
							{:else}
								<p>{selectedInstanceType.InstanceType}</p>
							{/if}

							<Button
								on:click={async () => {
									showInstanceTypeModal = true;
								}}
							>
								Select Instance
							</Button>
						</div>
					</div>

					<div class="flex flex-col">
						<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
							Storage
						</h1>

						<div class="flex space-x-2">
							<div class="flex flex-col">
								<label for="storage" class="mb-2 text-text-light dark:text-text-dark">
									Root Volume Type
								</label>
								<Select.Root portal={null} bind:selected={volumeTypeValue}>
									<Select.Trigger id="storage" class="w-[270px]">
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
									<Select.Input />
								</Select.Root>
							</div>

							<div class="flex flex-col">
								<label for="storage" class="mb-2 text-text-light dark:text-text-dark">GiB</label>
								<Input id="storage" type="number" min="1" max="10000" bind:value={storageSize} />
							</div>
						</div>
					</div>
				</div>

				<div class="flex">
					<p>WHAT</p>
				</div>
			</div>

			<div class="w-full">
				<div class="mb-4">
					{#if nameValue.length === 0}
						<div class="flex items-center space-x-1">
							<CircleX size="16" class="text-text2-light dark:text-text2-dark" />
							<p class="text-text2-light dark:text-text2-dark">Set a valid instance name</p>
						</div>
					{:else}
						<div class="flex items-center space-x-1">
							<CircleCheckIcon size="16" class="text-green-600 dark:text-green-600" />
							<p class="text-green-600 dark:text-green-600">Set a valid instance name</p>
						</div>
					{/if}

					{#if selectedAmi === null}
						<div class="flex items-center space-x-1">
							<CircleX size="16" class="text-text2-light dark:text-text2-dark" />
							<p class="text-text2-light dark:text-text2-dark">Select an AMI</p>
						</div>
					{:else}
						<div class="flex items-center space-x-1">
							<CircleCheckIcon size="16" class="text-green-600 dark:text-green-600" />
							<p class="text-green-600 dark:text-green-600">Select an AMI</p>
						</div>
					{/if}

					{#if selectedInstanceType === null}
						<div class="flex items-center space-x-1">
							<CircleX size="16" class="text-text2-light dark:text-text2-dark" />
							<p class="text-text2-light dark:text-text2-dark">Select an instance type</p>
						</div>
					{:else}
						<div class="flex items-center space-x-1">
							<CircleCheckIcon size="16" class="text-green-600 dark:text-green-600" />
							<p class="text-green-600 dark:text-green-600">Select an instance type</p>
						</div>
					{/if}
				</div>
				<Button type="submit" disabled={submitDisabled} class="self-start">Create</Button>
			</div>
		</form>
	</div>
</div>
