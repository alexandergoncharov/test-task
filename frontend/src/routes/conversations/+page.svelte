<script lang="ts">
	import { onMount } from 'svelte';
	import { conversationsStore } from '$lib/stores/conversations';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	onMount(() => {
		if ($auth.isAuthenticated) {
			conversationsStore.fetchAll();
		} else {
			goto('/login');
		}
	});

	function getConversationName(participants: string[]) {
		const otherParticipant = participants.find((p) => p !== $auth.user?.id);
		return otherParticipant ? `Chat with ${otherParticipant}` : 'Conversation';
	}
</script>

<section class="conversations-page">
	<div class="header">
		<h1>Conversations</h1>
		<p>View your existing private chats.</p>
	</div>

	{#if $conversationsStore.loading}
		<p class="status">Loading conversations...</p>
	{:else if $conversationsStore.error}
		<p class="status error">{$conversationsStore.error}</p>
	{:else if $conversationsStore.items.length === 0}
		<p class="status">No conversations yet. Start one from the Users page.</p>
	{:else}
		<ul class="conversation-list">
			{#each $conversationsStore.items as conversation}
				<li class="conversation-card">
					<div>
						<p class="title">{getConversationName(conversation.participants)}</p>
						<p class="meta">
							Last updated {new Date(conversation.updatedAt).toLocaleString()}
						</p>
					</div>
					<a class="open-btn" href={`/chat/${conversation.id}`}>Open chat</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.conversations-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header h1 {
		margin: 0;
		color: #1d1d1f;
	}

	.header p {
		margin: 0.2rem 0 0;
		color: #5f6368;
	}

	.status {
		color: #5f6368;
	}

	.status.error {
		color: #d93025;
	}

	.conversation-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.conversation-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.2rem;
		border-radius: 10px;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		gap: 1rem;
	}

	.title {
		margin: 0 0 0.25rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.meta {
		margin: 0;
		color: #5f6368;
		font-size: 0.9rem;
	}

	.open-btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		background: #646cff;
		color: #fff;
		text-decoration: none;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.open-btn:hover {
		background: #5057d6;
	}
</style>

