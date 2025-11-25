<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { messagesStore } from '$lib/stores/messages';
	import { sendMessage } from '$lib/services/messages';
	import { conversationsStore } from '$lib/stores/conversations';
	import { goto } from '$app/navigation';
	import {
		connectSocket,
		joinConversation,
		leaveConversation,
		onNewMessage
	} from '$lib/services/socket';

	let messageContent = '';
	let sending = false;
	let error = '';

	const conversationId = $page.params.conversationId as string;
	let otherParticipantId = '';
	let unsubscribeMessage: (() => void) | null = null;

	onMount(async () => {
		await messagesStore.fetchByConversation(conversationId);

		// Find other participant
		const conversation = $conversationsStore.items.find((c) => c.id === conversationId);
		if (conversation) {
			otherParticipantId = conversation.participants.find((id) => id !== $auth.user?.id) || '';
		}

		// Connect WebSocket and join conversation
		if ($auth.token) {
			try {
				await connectSocket($auth.token);
				await joinConversation(conversationId);
				setupMessageListener();
			} catch (err) {}
		}

		function setupMessageListener() {
			unsubscribeMessage = onNewMessage((message) => {
				if (message.conversationId === conversationId) {
					messagesStore.addMessage(message);
				}
			});
		}
	});

	onDestroy(() => {
		if (unsubscribeMessage) {
			unsubscribeMessage();
		}
		leaveConversation(conversationId);
		messagesStore.clear();
	});

	async function handleSend() {
		if (!messageContent.trim() || sending) return;

		const content = messageContent.trim();
		messageContent = '';
		sending = true;
		error = '';

		try {
			await sendMessage(conversationId, content);
		} catch (err) {
			messageContent = content;
			error = (err as { message?: string }).message || 'Failed to send message';
		} finally {
			sending = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}
</script>

<div class="chat-page">
	<div class="chat-header">
		<button class="back-button" on:click={() => goto('/conversations')}>← Back</button>
		<h2>Chat</h2>
	</div>

	<div class="messages-container">
		{#if $messagesStore.loading}
			<p class="status">Loading messages...</p>
		{:else if $messagesStore.error}
			<p class="status error">{$messagesStore.error}</p>
		{:else if $messagesStore.items.length === 0}
			<p class="status">No messages yet. Start the conversation!</p>
		{:else}
			<div class="messages-list">
				{#each $messagesStore.items as message}
					<div class="message {message.senderId === $auth.user?.id ? 'own' : 'other'}">
						<div class="message-content">{message.content}</div>
						<div class="message-time">
							{new Date(message.createdAt).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if error}
		<div class="alert error">{error}</div>
	{/if}

	<div class="message-input-container">
		<input
			type="text"
			placeholder="Type a message..."
			bind:value={messageContent}
			on:keypress={handleKeyPress}
			disabled={sending}
		/>
		<button on:click={handleSend} disabled={sending || !messageContent.trim()}>
			{sending ? 'Sending...' : 'Send'}
		</button>
	</div>
</div>

<style>
	.chat-page {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 120px);
		max-width: 800px;
		margin: 0 auto;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.chat-header {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		color: #646cff;
		padding: 0.5rem;
	}

	.back-button:hover {
		color: #535bf2;
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #1d1d1f;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	.status {
		text-align: center;
		color: #5f6368;
		margin: 2rem 0;
	}

	.status.error {
		color: #d93025;
	}

	.messages-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message {
		display: flex;
		flex-direction: column;
		max-width: 70%;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		word-wrap: break-word;
	}

	.message.own {
		align-self: flex-end;
		background: #646cff;
		color: white;
	}

	.message.other {
		align-self: flex-start;
		background: #f1f3f5;
		color: #1d1d1f;
	}

	.message-content {
		margin-bottom: 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		opacity: 0.7;
		align-self: flex-end;
	}

	.alert {
		padding: 0.75rem 1rem;
		margin: 0 1.5rem;
		border-radius: 6px;
		font-weight: 500;
	}

	.alert.error {
		background: #fdecea;
		color: #c62828;
	}

	.message-input-container {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid #e0e0e0;
	}

	.message-input-container input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 1px solid #dfe1e6;
		border-radius: 8px;
		font-size: 1rem;
	}

	.message-input-container input:focus {
		outline: none;
		border-color: #646cff;
	}

	.message-input-container input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	.message-input-container button {
		padding: 0.75rem 1.5rem;
		background: #646cff;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.message-input-container button:hover:not(:disabled) {
		background: #535bf2;
	}

	.message-input-container button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
</style>
