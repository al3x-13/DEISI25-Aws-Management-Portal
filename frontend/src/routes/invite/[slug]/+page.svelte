<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import NavbarLogo from '$lib/assets/NavbarLogo.svelte';
	import PageTitle from '$lib/assets/PageTitle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { CircleCheckIcon, CircleX } from 'lucide-svelte';
	import { checkUsernameAvailabilityClientside } from '../../../global/user-utils';
	import { page } from '$app/stores';

	export let form: PageData;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let usernameValue = '';
	let validUsername = false;
	let emailValue = '';
	let validEmail = false;
	let passwordValue = '';
	let validPassword = false;
	let uuid = $page.url.pathname.substring(8).replaceAll('/', '');
	let usernameTimeout: string | number | NodeJS.Timeout | undefined;
	let submitDisabled = true;

	$: {
		validEmail = emailRegex.test(emailValue);
		validPassword = passwordValue.length >= 8;
		submitDisabled = !(validUsername && validPassword && validEmail);
	}

	function handleUsernameInput() {
		usernameValue = usernameValue.replace(' ', '-');
		usernameValue = usernameValue.replace(/[^a-zA-Z0-9-.]/g, '');
		if (usernameValue.length === 0) validUsername = false;
	}

	function validateUsername() {
		clearTimeout(usernameTimeout);
		usernameTimeout = setTimeout(async () => {
			validUsername = false;
			validUsername = await checkUsernameAvailabilityClientside(usernameValue);
		}, 300);
	}

	function handleFormData(formData: FormData) {
		formData.set('uuid', uuid);
		formData.set('username', usernameValue);
		formData.set('password', passwordValue);
		formData.set('email', emailValue);
		return formData;
	}
</script>

<nav
	class="fixed w-full h-[60px] flex items-center justify-end bg-bg2-light dark:bg-bg2-dark border-b-[1.5px] border-border-light dark:border-border-dark px-4 py-1 z-20"
>
	<div class="fixed w-full mx-auto">
		<NavbarLogo />
	</div>
</nav>
<div class="bg-bg-light dark:bg-bg-dark min-h-screen w-full flex items-start justify-center pt-24">
	<div class="max-w-3xl w-full mt-16">
		<PageTitle title="Create User" />

		<form
			method="POST"
			action="?/createUser"
			use:enhance={({ formData }) => {
				handleFormData(formData);

				return async ({ result }) => {
					await applyAction(result);

					if (form) {
						if (form.success) {
							toast.success('User created successfully');
							goto('/login');
							return;
						} else {
							toast.error('Failed to create user');
						}
					}
				};
			}}
			class="w-full flex flex-col items-center justify-center mt-20"
		>
			<div>
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Username
				</h1>
				<Input
					type="text"
					placeholder="Username"
					bind:value={usernameValue}
					on:input={() => {
						handleUsernameInput();
						validateUsername();
					}}
					class="w-[350px]"
				/>

				<div class="flex items-center text-sm space-x-1 mt-1">
					{#if validUsername}
						<CircleCheckIcon size="12" class="text-green-600 dark:text-green-600" />
						<p class="text-green-600 dark:text-green-600">Username is available</p>
					{:else}
						<CircleX size="12" class="text-text2-light dark:text-text2-dark" />
						<p class="text-text2-light dark:text-text2-dark">Invalid username</p>
					{/if}
				</div>
			</div>

			<div class="mt-5">
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Email
				</h1>
				<Input type="email" placeholder="Email" bind:value={emailValue} class="w-[350px]" />

				<div class="flex items-center text-sm space-x-1 mt-1">
					{#if validEmail}
						<CircleCheckIcon size="12" class="text-green-600 dark:text-green-600" />
						<p class="text-green-600 dark:text-green-600">Valid email</p>
					{:else}
						<CircleX size="12" class="text-text2-light dark:text-text2-dark" />
						<p class="text-text2-light dark:text-text2-dark">Invalid email</p>
					{/if}
				</div>
			</div>

			<div class="mt-5">
				<h1 class="text-xl font text-color-primary-light dark:text-color-primary-dark mb-3">
					Password
				</h1>
				<Input
					type="password"
					placeholder="Password"
					bind:value={passwordValue}
					class="w-[350px]"
				/>

				<div class="flex items-center text-sm space-x-1 mt-1">
					{#if validPassword}
						<CircleCheckIcon size="12" class="text-green-600 dark:text-green-600" />
						<p class="text-green-600 dark:text-green-600">Valid password</p>
					{:else}
						<CircleX size="12" class="text-text2-light dark:text-text2-dark" />
						<p class="text-text2-light dark:text-text2-dark">Must have at least 8 characters</p>
					{/if}
				</div>
			</div>

			<Button type="submit" class="mt-20" disabled={submitDisabled}>Submit</Button>
		</form>
	</div>
</div>
