<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();
	});
</script>

<main>
	<slot />
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
	}
</style>

