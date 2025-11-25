import { writable } from 'svelte/store';
import { apiRequest } from '$lib/services/api';

export interface Conversation {
	id: string;
	participants: string[];
	createdAt: string;
	updatedAt: string;
	lastMessage?: {
		content: string;
		senderId: string;
		createdAt: string;
	};
}

interface ConversationsState {
	items: Conversation[];
	loading: boolean;
	error: string | null;
}

function createConversationsStore() {
	const { subscribe, set, update } = writable<ConversationsState>({
		items: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		fetchAll: async () => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const data = await apiRequest<Conversation[]>('/conversations');
				set({ items: data, loading: false, error: null });
			} catch (error) {
				const message =
					(error as { message?: string }).message || 'Failed to load conversations';
				set({ items: [], loading: false, error: message });
			}
		},
		addOrUpdate: (conversation: Conversation) => {
			update((state) => {
				const filtered = state.items.filter((c) => c.id !== conversation.id);
				return {
					...state,
					items: [conversation, ...filtered].sort(
						(a, b) =>
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					)
				};
			});
		}
	};
}

export const conversationsStore = createConversationsStore();

