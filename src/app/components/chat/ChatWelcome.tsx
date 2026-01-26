'use client';
import React, { useEffect, useState } from 'react';
import Skeleton from './Skeleton';
import ChatSuggestionButton from './ChatSuggestionButton';

interface ChatWelcomeProps {
	onSuggestionClick: (prompt: string) => void;
	isLoadingAiResponse: boolean;
	isExpanded: boolean;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onSuggestionClick, isLoadingAiResponse, isExpanded }) => {
	const [prompts, setPrompts] = useState<string[]>([]);
	const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

	const loadInitialPrompts = async () => {
		setIsLoadingPrompts(true);

		try {
			 await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
				.then((res) => {
					if (!res.ok) {
						throw new Error(res.statusText);
					} else {
						return res.json();
					}
				})
				.then((data) => {
					const categories = data.categories.map(
						(category: { title: string }) => category.title
					);
					setPrompts(categories);
					return data.categories;
				});
		} catch (err) {
			console.error('Failed to load initial prompts from the database: ', err);
			setPrompts(['Laptop Issues', 'Desktop Issues', 'Printer Issues']);
		} finally {
			setIsLoadingPrompts(false);
		}
	};

	useEffect(() => {
		setIsLoadingPrompts(true);
		loadInitialPrompts();
	}, []);

	return (
		<section className={`w-full flex flex-col flex-grow items-center justify-center px-4 ${isExpanded ? "md:px-12" : ""}`}>
          <div className={`flex flex-col  items-center justify-center  rounded-md  w-full ${isExpanded ? "p-6 mt-24" : "p-2"}`}>
            <h1 className={`${isExpanded ? "text-xl md:text-3xl" : "text-lg"}  font-bold text-teal-600`}>Welcome to GoDChat</h1>
            <p className={`text-gray-500 text-center  m-4 ${isExpanded ? " text-xs md:text-sm": "text-xs"}`}>
              I&apos;m an AI assistant to collect information about your device.<br />
              What service are you looking for?
            </p>
            <div className="flex flex-wrap items-center justify-center">
			{isLoadingPrompts ? (
				<>
				<Skeleton />
				<Skeleton />
				<Skeleton />
				</>
			) : (
				prompts.map((prompt, index) => (
				<ChatSuggestionButton
					key={index}
					prompt={prompt}
					onClick={() => onSuggestionClick(prompt)}
					isLoading={isLoadingAiResponse}
				/>
				))
			)}
			</div>
		</div>
		</section>

	);
};

export default ChatWelcome;
