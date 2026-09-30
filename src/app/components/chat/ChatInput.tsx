'use client';
import { useCallback, useRef, useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface ChatInputProps {
	onSendMessage: (message: string) => Promise<void>;
	isLoading: boolean;
	onStartRecording?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStartRecording }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const textareaRef = useRef<HTMLInputElement | null>(null);

	const handleVoiceTranscript = useCallback(
		async (transcript: string) => {
			await onSendMessage(transcript);
		},
		[onSendMessage]
	);

	const handleVoiceError = useCallback((message: string) => toast.error(message), []);

	const { isRecording, isTranscribing, startRecording, stopRecording } = useAudioRecorder({
		onTranscript: handleVoiceTranscript,
		onError: handleVoiceError,
	});

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
		// Stop any bot audio still playing so it isn't picked up by the mic.
		onStartRecording?.();
		startRecording();
	};

	const statusText = isRecording
		? 'Listening… tap the mic to stop'
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
};

export default ChatInput;
