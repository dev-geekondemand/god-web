interface ChatSuggestionButtonProps {
	prompt: string;
	onClick: (prompt: string) => void;
	isLoading: boolean;
}

const ChatSuggestionButton = ({ prompt, onClick, isLoading }: ChatSuggestionButtonProps) => {
	return (
		<button
			disabled={isLoading}
			onClick={() => onClick(prompt)}
			className='w-fit py-1 px-2 mx-1.5 my-1.5 text-[12px] text-teal-600 bg-white border justify-center items-center text-center border-teal-300 cursor-pointer font-bold rounded-full text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'>
			{/* // className='bg-card w-fit py-1 px-2 mx-1 my-1 text-[12px] text-white bg-gradient-to-r from-blue-500 to-violet-500 border justify-center items-center text-center border-blue-300 rounded-full text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'> */}
			{prompt}
		</button>
	);
};
export default ChatSuggestionButton;
