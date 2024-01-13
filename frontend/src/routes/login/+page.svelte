<script lang="ts">
	import DarkModeButton from '$lib/assets/DarkModeButton.svelte';
	import LogoWithText from '$lib/assets/LogoWithText.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';

	let passwordHidden = true;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div
	class="w-full h-[100vh] flex flex-col items-center justify-between bg-gradient-to-tr from-[#DADADA] dark:from-[#19212E] to-[#F3F3F3] dark:to-[#253144]"
>
	<div class="w-full flex items-center justify-between py-6 px-8">
		<h1
			class="text-2xl font-oxygen font-[700] text-color-primary-light dark:text-color-primary-dark select-none"
		>
			Company Logo
		</h1>
		<DarkModeButton />
	</div>

	<div class="w-full flex flex-col items-center justify-center">
		<LogoWithText />

		<form
			method="POST"
			action="?/login"
			class="w-[400px] flex flex-col items-center justify-center mt-24"
		>
			<div class="relative w-full flex flex-col">
				<input
					type="text"
					id="username"
					name="username"
					placeholder=" "
					class="peer/name px-4 pt-6 pb-1 text-base md:text-lg font-[500] text-[#888888] dark:text-[#777777] bg-[#CCCCCC] dark:bg-[#BDBDBD] rounded-lg border-[3px] border-transparent focus:border-color-primary-light dark:focus:border-color-primary-dark focus:outline-0 focus:outline-offset-0 focus:ring-0 transition-all duration-[250ms] ease-in-out select-none"
				/>
				<label
					for="username"
					class="absolute text-lg md:text-xl text-[#888888] dark:text-[#777777] duration-[250ms] transform -translate-x-4 translate-y-0.5 px-5 scale-[0.7] bg-bg rounded-xl peer-placeholder-shown/name:scale-100 peer-focus/name:scale-[0.7] peer-placeholder-shown/name:translate-y-[1.15rem] peer-placeholder-shown/name:translate-x-0 peer-focus/name:translate-y-0.5 peer-focus/name:-translate-x-4 peer-focus/name:text-color-primary-light dark:peer-focus/name:text-color-primary-dark select-none"
				>
					Username
				</label>
			</div>

			<div class="relative w-full flex flex-col mt-6">
				<input
					type={passwordHidden ? 'password' : 'text'}
					id="password"
					name="password"
					placeholder=" "
					class="peer/pw px-4 pt-6 pb-1 text-base md:text-lg font-[500] text-[#888888] dark:text-[#777777] bg-[#CCCCCC] dark:bg-[#BDBDBD] rounded-lg border-[3px] border-transparent focus:border-color-primary-light dark:focus:border-color-primary-dark focus:outline-0 focus:outline-offset-0 focus:ring-0 transition-all duration-[250ms] ease-in-out select-none"
				/>
				<label
					for="password"
					class="absolute text-lg md:text-xl text-[#888888] dark:text-[#717171] duration-[250ms] transform -translate-x-4 translate-y-0.5 px-5 scale-[0.7] bg-bg rounded-xl peer-placeholder-shown/pw:scale-100 peer-focus/pw:scale-[0.7] peer-placeholder-shown/pw:translate-y-[1.15rem] peer-placeholder-shown/pw:translate-x-0 peer-focus/pw:translate-y-0.5 peer-focus/pw:-translate-x-4 peer-focus/pw:text-color-primary-light dark:peer-focus/pw:text-color-primary-dark select-none"
				>
					Password
				</label>
				<button
					class="absolute inset-y-0 right-0 flex items-center justify-center text-[#888888] dark:text-[#777777] rounded-r-lg px-4"
					on:click|preventDefault={() => (passwordHidden = !passwordHidden)}
				>
					{#if passwordHidden}
						<Eye size={25} />
					{:else}
						<EyeOff size={25} />
					{/if}
				</button>
			</div>

			<button
				class="w-40 flex items-cente justify-center text-lg text-zinc-200 bg-color-primary-light dark:bg-color-primary-dark rounded-md py-2.5 px-4 mt-12 shadow-xl active:shadow-md hover:brightness-110"
			>
				Login
			</button>
		</form>
	</div>

	<div class="w-full flex items-center justify-end">
		<div
			class="w-[40px] h-[40px] flex items-center justify-center text-2xl font-[700]
        text-zinc-500 bg-[#CCCCCC] rounded-full m-8 select-none"
		>
			<p>?</p>
		</div>
	</div>
</div>
