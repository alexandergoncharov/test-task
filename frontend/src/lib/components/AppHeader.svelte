<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const navLinks = [
		{ href: '/conversations', label: 'Conversations' },
		{ href: '/users', label: 'Users' }
	];

	function navigateTo(path: string) {
		goto(path);
	}

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<header class="app-header">
	<div class="logo" on:click={() => navigateTo('/conversations')}>
		<span>Real-time Chat</span>
	</div>

	{#if $auth.isAuthenticated}
		<nav class="nav">
			{#each navLinks as link}
				<a
					href={link.href}
					class:selected={$page.url.pathname === link.href}
					on:click|preventDefault={() => navigateTo(link.href)}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="user-controls">
			<div class="user-info">
				<span class="username">@{$auth.user?.username}</span>
				<span class="email">{$auth.user?.email}</span>
			</div>
			<button class="logout-btn" on:click={handleLogout}>Logout</button>
		</div>
	{:else}
		<div class="guest-links">
			<a href="/login">Login</a>
			<a href="/register">Register</a>
		</div>
	{/if}
</header>

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		background-color: #ffffff;
		border-bottom: 1px solid #eee;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.logo {
		font-weight: 700;
		font-size: 1.2rem;
		color: #2e2e2e;
		cursor: pointer;
	}

	.nav {
		display: flex;
		gap: 1rem;
	}

	.nav a {
		text-decoration: none;
		color: #555;
		font-weight: 500;
		padding-bottom: 0.2rem;
		border-bottom: 2px solid transparent;
		transition: all 0.2s ease;
	}

	.nav a:hover {
		color: #111;
	}

	.nav a.selected {
		color: #111;
		border-color: #646cff;
	}

	.user-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		text-align: right;
	}

	.username {
		font-weight: 600;
		color: #111;
	}

	.email {
		font-size: 0.85rem;
		color: #777;
	}

	.logout-btn {
		padding: 0.4rem 1rem;
		border: 1px solid #d0d0d0;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.logout-btn:hover {
		background: #f2f2f2;
	}

	.guest-links {
		display: flex;
		gap: 1rem;
	}

	.guest-links a {
		text-decoration: none;
		color: #646cff;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.app-header {
			flex-direction: column;
			gap: 1rem;
		}

		.user-controls {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>

