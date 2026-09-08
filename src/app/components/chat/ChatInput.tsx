'use client';
import { useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface ChatInputProps {
	onSendMessage: (message: string) => Promise<void>;
	isLoading: boolean;
	onStartRecording?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStartRecording }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const textareaRef = useRef<HTMLInputElement | null>(null);

	const handleVoiceTranscript = async (transcript: string) => {
		if (transcript.trim()) {
			await onSendMessage(transcript.trim());
		}
	};

	const { isRecording, startRecording, stopRecording } = useAudioRecorder(handleVoiceTranscript);

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
					onPointerDown={(e) => {
						e.preventDefault();
						onStartRecording?.();
						startRecording();
					}}
					onPointerUp={stopRecording}
					onPointerLeave={() => isRecording && stopRecording()}
					onPointerCancel={() => isRecording && stopRecording()}
					disabled={isLoading}
					aria-label={isRecording ? 'Stop recording' : 'Record voice message'}
					style={{ touchAction: 'none' }}
					className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors select-none ${
						isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}>
					{isRecording ? <Square size={16} /> : <Mic size={16} />}
				</button>
				<button
					type='submit'
					disabled={isLoading || !inputValue.trim()}
					className='bg-teal-500 rounded text-xs md:text-sm py-2 px-4 hover:bg-teal-600 cursor-pointer text-white font-medium'>
					Send
				</button>
			</div>
			<div className='mt-2 mb-0 text-gray-400 text-sm text-center'>
				Please note that you are interacting with an AI-powered assistant.
			</div>
		</form>
	);
};

export default ChatInput;
