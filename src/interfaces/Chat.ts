export interface ChatMessageInterface {
	id: string;
	content: string;
	role: string;
	timestamp: number;
	/**
	 * How the seeker produced this message. Absent on anything loaded from chat
	 * history, since the backend does not record it — treat undefined as 'text'.
	 */
	source?: 'voice' | 'text';
}

export interface SendMessageOptions {
	source?: 'voice' | 'text';
	/**
	 * Rewind to this message instead of appending: its text is swapped for the new
	 * one and everything after it is dropped. Used by the voice re-record action.
	 */
	replaceMessageId?: string;
}
