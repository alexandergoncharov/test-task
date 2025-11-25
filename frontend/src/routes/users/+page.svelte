<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { usersStore } from '$lib/stores/users';
	import { createConversation } from '$lib/services/conversations';
	import { goto } from '$app/navigation';

	let successMessage = '';
	let errorMessage = '';

	let hasFetched = false;

	onMount(() => {
		if ($auth.isAuthenticated) {
			usersStore.fetchUsers();
			hasFetched = true;
		}
	});

	$: if ($auth.isAuthenticated && !hasFetched) {
		usersStore.fetchUsers();
		hasFetched = true;
	}

	async function handleStartConversation(userId: string) {
		try {
			successMessage = '';
			errorMessage = '';
			const conversation = await createConversation(userId);
			successMessage = 'Conversation created! Redirecting...';
			setTimeout(() => goto(`/conversations?id=${conversation.id}`), 800);
		} catch (error) {
			errorMessage =
				(error as { message?: string }).message ||
				'Failed to create conversation';
		}
	}
</script>

<section class="users-page">
	<div class="header">
		<h1>Users</h1>
		<p>Start a conversation with any registered user.</p>
	</div>

	{#if $usersStore.loading}
		<p class="status">Loading users...</p>
	{:else if $usersStore.error}
		<p class="status error">{$usersStore.error}</p>
	{:else if $usersStore.users.filter((user) => user.id !== $auth.user?.id).length === 0}
		<p class="status">No users found.</p>
	{:else}
		<ul class="users-list">
			{#each $usersStore.users.filter((user) => user.id !== $auth.user?.id) as user}
				<li class="user-card">
					<div class="info">
						<span class="username">@{user.username}</span>
						<span class="email">{user.email}</span>
					</div>
					<button on:click={() => handleStartConversation(user.id)}>
						Start Conversation
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if successMessage}
		<div class="alert success">{successMessage}</div>
	{/if}

	{#if errorMessage}
		<div class="alert error">{errorMessage}</div>
	{/if}
</section>

<style>
	.users-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		margin: 0;
		color: #1d1d1f;
	}

	p {
		margin: 0.2rem 0 0;
		color: #5f6368;
	}

	.status {
		color: #5f6368;
	}

	.status.error {
		color: #d93025;
	}

	.users-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.user-card {
		background: #fff;
		border-radius: 10px;
		padding: 1rem 1.2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		gap: 1rem;
	}

	.user-card .info {
		display: flex;
		flex-direction: column;
	}

	.username {
		font-weight: 600;
		color: #1d1d1f;
		font-size: 1rem;
	}

	.email {
		color: #5f6368;
		font-size: 0.9rem;
	}

	button {
		padding: 0.6rem 1rem;
		border-radius: 6px;
		border: none;
		background: #646cff;
		color: #fff;
		cursor: pointer;
		transition: background 0.2s ease;
		font-weight: 500;
	}

	button:hover {
		background: #5057d6;
	}

	.alert {
		padding: 0.8rem 1rem;
		border-radius: 6px;
		font-weight: 500;
	}

	.alert.success {
		background: #e8f5e9;
		color: #1b5e20;
	}

	.alert.error {
		background: #fdecea;
		color: #c62828;
	}
</style>

