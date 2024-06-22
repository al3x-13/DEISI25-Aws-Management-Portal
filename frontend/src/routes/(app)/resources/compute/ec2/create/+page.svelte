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
		getEc2InstanceTypesClientside
	} from '../../../../../../global/ec2-instances';
	import AmiModal from '$lib/components/ec2/AmiModal.svelte';
	import InstanceTypeModal from '$lib/components/ec2/InstanceTypeModal.svelte';
	import { onMount } from 'svelte';

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
	let volumeTypeValue = volumeTypes.at(0);
	let submitDisabled = true;
	let selectedOs: Ec2ImageBaseOs | null = null;
	let selectedAmi: Ec2Image | null = null;
	let selectedInstanceType: Ec2InstanceType | null = null;

	// selection data
	let amis: Ec2Image[] = [];
	let instanceTypes: Ec2InstanceType[] | null = null;

	$: {
		if (nameValue.length === 0) {
			submitDisabled = true;
		} else {
			submitDisabled = false;
		}
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

	onMount(async () => fetchInstanceTypes());

	// Modals state
	let showAmiModal = false;
	let showInstanceTypeModal = false;
</script>

<div class="w-full flex flex-col items-center">
	<div class="w-fit flex flex-col items-center justify-center">
		<PageTitle title="New EC2 Instance" />

		<form
			method="POST"
			action="?/createInstance"
			use:enhance={() => {
				return async ({ result, update }) => {
					await applyAction(result);

					if (form) {
						if (form.success) {
							console.log('this working');
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
						<Input type="text" placeholder="Web Server" bind:value={nameValue} class="w-[350px]" />
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
				</div>

				<div class="flex flex-col basis-1/2 space-y-12">
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
					<!-- <div> -->
					<!-- 	<Select.Root portal={null} name="instanceType"> -->
					<!-- 		<Select.Trigger class="w-[250px]"> -->
					<!-- 			<Select.Value placeholder="Select an instance type" /> -->
					<!-- 		</Select.Trigger> -->
					<!-- 		<Select.Content> -->
					<!-- 			<Select.Group> -->
					<!-- 				{#each instanceTypes as instance} -->
					<!-- 					<Select.Item value={instance.value} label={instance.label} -->
					<!-- 						>{instance.label}</Select.Item -->
					<!-- 					> -->
					<!-- 				{/each} -->
					<!-- 			</Select.Group> -->
					<!-- 		</Select.Content> -->
					<!-- 		<Select.Input name="instanceType" /> -->
					<!-- 	</Select.Root> -->
					<!-- </div> -->

					<div class="flex flex-col">
						<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
							Storage
						</h1>

						<div class="flex space-x-2">
							<div class="flex flex-col">
								<label for="storage" class="mb-2 text-text-light dark:text-text-dark">
									Root Volume Type
								</label>
								<Select.Root portal={null} name="storageType" bind:selected={volumeTypeValue}>
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
									<Select.Input name="storageType" />
								</Select.Root>
							</div>

							<div class="flex flex-col">
								<label for="storage" class="mb-2 text-text-light dark:text-text-dark">GiB</label>
								<Input
									id="storage"
									name="storageSize"
									type="number"
									min="1"
									max="10000"
									value="8"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Button type="submit" disabled={submitDisabled} class="self-start">Create</Button>
		</form>
	</div>
</div>
