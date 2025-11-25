<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { beforeNavigate } from '$app/navigation';

	const publicRoutes = ['/', '/login', '/register'];
	let isInitialized = false;

	onMount(() => {
		auth.init();
		isInitialized = true;
	});

	beforeNavigate(({ to, cancel }) => {
		if (!to || !isInitialized) return;

		const pathname = to.url.pathname;
		const isPublic = publicRoutes.includes(pathname);

		// Redirect to login if not authenticated and trying to access protected route
		if (!$auth.isAuthenticated && !isPublic) {
			cancel();
			goto('/login');
			return;
		}

		// Redirect to conversations if authenticated and on public route
		if ($auth.isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
			cancel();
			goto('/conversations');
			return;
		}
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

