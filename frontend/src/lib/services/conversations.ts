import { apiRequest } from '$lib/services/api';

export interface Conversation {
	id: string;
	participants: string[];
	createdAt: string;
	updatedAt: string;
}

export async function createConversation(participantId: string) {
	return apiRequest<Conversation>('/conversations', {
		method: 'POST',
		body: JSON.stringify({ participantId })
	});
}

