<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import AppHeader from '$lib/components/AppHeader.svelte';

	const publicRoutes = ['/', '/login', '/register'];
	let isInitialized = false;
	let lastRedirect: string | null = null;

	onMount(() => {
		auth.init();
		isInitialized = true;
	});

	function redirect(path: string) {
		if (lastRedirect === path) return;
		lastRedirect = path;
		goto(path).finally(() => {
			lastRedirect = null;
		});
	}

	$: if (isInitialized) {
		const pathname = $page.url.pathname;
		const isPublic = publicRoutes.includes(pathname);

		if (!$auth.isAuthenticated && !isPublic) {
			redirect('/login');
		} else if (
			$auth.isAuthenticated &&
			(pathname === '/login' || pathname === '/register' || pathname === '/')
		) {
			redirect('/conversations');
		}
	}

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
	<AppHeader />
	<section class="page-content">
		<slot />
	</section>
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f6f7fb;
	}

	.page-content {
		flex: 1;
		padding: 1.5rem;
	}
</style>

