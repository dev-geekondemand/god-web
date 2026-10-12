'use client';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { SendMessageOptions } from '@/interfaces/Chat';

interface ChatInputProps {
	onSendMessage: (message: string, options?: SendMessageOptions) => Promise<void>;
	isLoading: boolean;
	onStartRecording?: () => void;
	/** Fires with the message being re-recorded, or null once that attempt ends. */
	onVoiceRetryChange?: (messageId: string | null) => void;
}

export interface ChatInputHandle {
	/** Record again and send the result as a replacement for `messageId`. */
	startVoiceRetry: (messageId: string) => void;
}

const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
	{ onSendMessage, isLoading, onStartRecording, onVoiceRetryChange },
	ref
) {
	const [inputValue, setInputValue] = useState<string>('');
	const textareaRef = useRef<HTMLInputElement | null>(null);
	// A ref, not state: useAudioRecorder's onstop closes over the onTranscript it
	// had when startRecording ran, so a state write in the same tick would not be
	// visible to it. The mirrored state only drives the status text.
	const retryTargetRef = useRef<string | null>(null);
	const [retryTargetId, setRetryTargetId] = useState<string | null>(null);

	const updateRetryTarget = useCallback(
		(messageId: string | null) => {
			retryTargetRef.current = messageId;
			setRetryTargetId(messageId);
			onVoiceRetryChange?.(messageId);
		},
		[onVoiceRetryChange]
	);

	const handleVoiceTranscript = useCallback(
		async (transcript: string) => {
			const replaceMessageId = retryTargetRef.current ?? undefined;
			updateRetryTarget(null);
			await onSendMessage(transcript, { source: 'voice', replaceMessageId });
		},
		[onSendMessage, updateRetryTarget]
	);

	const handleVoiceError = useCallback(
		(message: string) => {
			updateRetryTarget(null);
			toast.error(message);
		},
		[updateRetryTarget]
	);

	const { isRecording, isTranscribing, startRecording, stopRecording } = useAudioRecorder({
		onTranscript: handleVoiceTranscript,
		onError: handleVoiceError,
	});

	useImperativeHandle(
		ref,
		() => ({
			startVoiceRetry: (messageId: string) => {
				if (isTranscribing) return;
				// Tapping the bubble action again stops the take, so the seeker never has
				// to hunt for the composer mic to finish a re-record they started here.
				if (isRecording) {
					if (retryTargetRef.current === messageId) stopRecording();
					return;
				}
				updateRetryTarget(messageId);
				onStartRecording?.();
				startRecording();
			},
		}),
		[isRecording, isTranscribing, onStartRecording, startRecording, stopRecording, updateRetryTarget]
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setInputValue('');
		await onSendMessage(inputValue.trim());
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.focus();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as unknown as React.FormEvent);
		}
	};

	const handleMicClick = () => {
		if (isRecording) {
			stopRecording();
			return;
		}
		// A fresh tap on the composer mic is a new message, never a replacement.
		updateRetryTarget(null);
		// Stop any bot audio still playing so it isn't picked up by the mic.
		onStartRecording?.();
		startRecording();
	};

	const isRetrying = retryTargetId !== null;

	const statusText = isRecording
		? isRetrying
			? 'Listening… say it again, then tap the mic to stop'
			: 'Listening… tap the mic to stop'
		: isTranscribing
		? 'Transcribing your voice…'
		: 'Please note that you are interacting with an AI-powered assistant.';

	return (
		<form className='w-full p-4 pb-0 bg-background/80 backdrop-blur-sm' onSubmit={handleSubmit}>
			<div className='flex items-end space-x-2'>
				<input
					ref={textareaRef}
					type='text'
					placeholder='Type your message here'
					className='w-full text-xs md:text-sm flex-1 p-2 rounded border border-teal-300 focus:outline-none focus:border-teal-500'
					value={inputValue}
					onKeyDown={handleKeyDown}
					onChange={handleInputChange}
				/>
				<button
					type='button'
					onClick={handleMicClick}
					disabled={isTranscribing}
					aria-label={
						isRecording
							? 'Stop recording'
							: isTranscribing
							? 'Transcribing'
							: 'Record voice message'
					}
					title={
						isRecording
							? 'Tap to stop recording'
							: isTranscribing
							? 'Transcribing…'
							: 'Tap to speak'
					}
					className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors select-none disabled:opacity-60 ${
						isRecording
							? 'bg-red-500 text-white animate-pulse'
							: isTranscribing
							? 'bg-gray-300 text-gray-700 animate-pulse'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}>
					{isRecording ? (
						<Square size={16} />
					) : isTranscribing ? (
						<Loader2 size={16} className='animate-spin' />
					) : (
						<Mic size={16} />
					)}
				</button>
				<button
					type='submit'
					disabled={isLoading || !inputValue.trim()}
					className='bg-teal-500 rounded text-xs md:text-sm py-2 px-4 hover:bg-teal-600 cursor-pointer text-white font-medium'>
					Send
				</button>
			</div>
			<div className='mt-2 mb-0 text-gray-400 text-xs md:text-sm text-center'>{statusText}</div>
		</form>
	);
});

export default ChatInput;
