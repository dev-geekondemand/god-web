'use client';
import { useRef, useState } from 'react';

interface ChatInputProps {
	onSendMessage: (message: string) => Promise<void>;
	isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const textareaRef = useRef<HTMLInputElement | null>(null);

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
