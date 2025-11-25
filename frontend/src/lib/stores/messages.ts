import { writable } from 'svelte/store';
import { apiRequest } from '$lib/services/api';

export interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	content: string;
	createdAt: string;
}

interface MessagesState {
	items: Message[];
	loading: boolean;
	error: string | null;
}

function createMessagesStore() {
	const { subscribe, set, update } = writable<MessagesState>({
		items: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		fetchByConversation: async (conversationId: string) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const data = await apiRequest<Message[]>(`/messages/${conversationId}`);
				set({ items: data, loading: false, error: null });
			} catch (error) {
				const message =
					(error as { message?: string }).message || 'Failed to load messages';
				set({ items: [], loading: false, error: message });
			}
		},
		addMessage: (message: Message) => {
			update((state) => ({
				...state,
				items: [...state.items, message]
			}));
		},
		clear: () => {
			set({ items: [], loading: false, error: null });
		}
	};
}

export const messagesStore = createMessagesStore();

