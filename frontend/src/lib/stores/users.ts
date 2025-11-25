import { writable } from 'svelte/store';
import { apiRequest } from '$lib/services/api';
import type { User } from '$lib/stores/auth';

interface UsersState {
	users: User[];
	loading: boolean;
	error: string | null;
}

function createUsersStore() {
	const { subscribe, set, update } = writable<UsersState>({
		users: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		fetchUsers: async () => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const data = await apiRequest<User[]>('/users');
				set({ users: data, loading: false, error: null });
			} catch (error) {
				const message = (error as { message?: string }).message || 'Failed to load users';
				set({ users: [], loading: false, error: message });
			}
		}
	};
}

export const usersStore = createUsersStore();

