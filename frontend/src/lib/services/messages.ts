import { apiRequest } from './api';
import type { Message } from '../stores/messages';

export async function sendMessage(
	conversationId: string,
	content: string
): Promise<Message> {
	return apiRequest<Message>('/messages', {
		method: 'POST',
		body: JSON.stringify({
			conversationId,
			content
		})
	});
}

