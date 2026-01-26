'use client';

import { useState, useEffect, useRef, JSX, } from 'react';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';

// import loader from '/assets/gifs/loader.gif';
import ChatWelcome from './chat/ChatWelcome';
import ChatSuggestionButton from './chat/ChatSuggestionButton';
import GeekCard from './GeekCard';
import   { GeekData } from '@/interfaces/Geek';
import Image from 'next/image';
import { ChatMessageInterface } from '@/interfaces/Chat';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import User from '@/interfaces/Seeker';
import toast from 'react-hot-toast';
import Pagination from './Pagination';
import CustomModel from './CustomModal';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { getCategories } from '@/features/category/categorySlice';
import { Category } from '@/interfaces/Category';
import { UserIssue } from '@/interfaces/UserIssue';
import { createRequest, getSeekerRequests, ServiceState } from '@/features/request/requestSlice';
import { ServiceRequest } from '@/interfaces/ServiceRequest';
import { Maximize2, Minus } from 'lucide-react';

function Chat({setOpenChat, isExpanded, setIsExpanded}:{setOpenChat: (value: boolean)=>void, isExpanded: boolean, setIsExpanded: (value: boolean)=>void}): JSX.Element {
	const [messages, setMessages] = useState<Array<ChatMessageInterface>>([]);
	const [options, setOptions] = useState<Array<string>>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isGeekOption, setIsGeekOption] = useState<boolean>(false);
	const [geeks, setGeeks] = useState<Array<GeekData>>([]);
	const [userId, setUserId] = useState<string>('');
	const bottomRef = useRef<HTMLDivElement>(null);
	const textBufferRef = useRef<string>('');
	const [page,setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(3);
	const [fetchedChatHistory, setFetchedChatHistory] = useState(false);
	const [userIssue,setUserIssue] = useState<UserIssue>();
	const [error, setError] = useState<string | null>(null);


	const ws = useRef<WebSocket | null>(null);


	const user = useSelector((state: RootState) => state.seeker?.user) as User;

const dispatch = useAppDispatch();

	const seekerRequests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];

	useEffect(() => {
		const userType = localStorage.getItem('userType');
		if (userType === 'geek') {
			setOpenChat(false);
		}
		if (user?._id) {
			setUserId(user?._id);
		}
	}, [setOpenChat, user]);

    const conversationId = userId ? `${userId}-conversation-id` : null;



	useEffect(() => {

			const getChatHistory = async () => {
				try {

					if(!conversationId || conversationId === '' || conversationId === "-conversation-id") {
						return;
					}
					const { data } = await axios.get(
						`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/chat/chat_history/${conversationId}`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					if (data[0]) {
						const formattedMessages = data[0].chat_messages.map((message:{
							message: string,
							sender: string,
							sentAt: string
						}) => {
							return {
								id: Date.now().toString(),
								content: message.message,
								role: message.sender,
								timestamp: message.sentAt,
							};
						});
						setMessages(formattedMessages);
						setFetchedChatHistory(true);
					}
				}catch (error) {
					console.error(error);
					setError(
						"Unable to connect to the chat server. Please check your connection or try again later."
					);
				}

		};
		if (userId) {
			if (messages.length <= 0) {
				getChatHistory();
			}
		}
	}, [conversationId, messages.length, userId]);

	

	useEffect(() => {
		const sendMessage = async ()=>{

				ws.current = new WebSocket(
				`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${userId}?conversation_id=${conversationId}`
			);

			ws.current.onopen = () => {
				console.log('WebSocket connection opened');
			};

			ws.current.onmessage = (event) => {
				const data = event.data;

				if (!data || data === '[END]') {
					setIsLoading(false); // Make sure to turn off loading
					return;
				}

				// NON-STREAMING RESPONSE
				try {
					const fullResponse = JSON.parse(data);
					const { response, options } = fullResponse;
					

					const botMessage = {
						id: Date.now().toString(),
						content: response,
						role: 'bot',
						timestamp: Date.now(),
					};
					setMessages((prev: ChatMessageInterface[]) => [...prev, botMessage]);
					// setCurrentBotMessage(null);
					// currentBotMessageRef.current = null;
					// textBufferRef.current = '';
					if (response === 'Please select a Geek to proceed') {
						const geekOptions = JSON.parse(options[0]);
						console.log(geekOptions);
						setPage(geekOptions?.page);
						setTotalPages(geekOptions?.pages);
						setUserIssue(geekOptions?.user_issue);
						
						const suitableGeeks = geekOptions.geeks;
						setGeeks(suitableGeeks);
						console.log(suitableGeeks);
						
						setIsGeekOption(true);
						setOptions([]);
					} else {
						setGeeks([]);
						setPage(page)
						setIsGeekOption(false);
						setOptions(options || []);
					}
					setIsLoading(false);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					toast.error('Something went wrong. Please try again.');
					setIsLoading(false);
					setOptions([]);
					setGeeks([]);
					setIsGeekOption(false);
				}


			};

			ws.current.onclose = () => {
				console.log('WebSocket connection closed');
				setIsLoading(false);
			};

			ws.current.onerror = () => {
				setError(
					"Chat service is currently unavailable. Please try again later."
					);
				setIsLoading(false);
			};



			return () => {
				if (ws.current && ws.current.readyState === WebSocket.OPEN) {
					ws.current.close();
					<p>The connection has been closed.</p>;
				}
			};
		}

		if (userId) {
			sendMessage();
		}
	}, [conversationId, page, userId]);



	const handleMessageSend = async (content: string) => {
		if (!userId || userId === '') {
			toast.error('User not found');
		}
		setError(null);
		const userMessage = {
			id: Date.now().toString(),
			content: content.toString(),
			role: 'user',
			timestamp: Date.now(),
		};
		setMessages((prev) => {
			const updated = [...prev, userMessage];
			return updated;
		});

		
		console.log(content);
		setIsLoading(true);
		textBufferRef.current = '';
		setOptions([]);
		console.log(ws.current);
		
		try {
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				ws.current.send(content);
			} else {
				console.log('WebSocket is not open');
			}
		}catch (error) {
			console.error('Error sending message:', error);
			setError("Failed to send message. Please try again.");
			setIsLoading(false);
		}

	};


	const handleGeekCardClick = (geek: GeekData) => {
		console.log(userIssue);
		let selectedCategoryId = '';
		if (userIssue !== null) {
			const category = categories?.find((value: object): value is Category => {
				return value && 'title' in value && value.title === (userIssue as UserIssue)?.category_details?.category;
			});

			if(category?._id){
				selectedCategoryId = category._id;
			}
		}
				console.log(requestState?.requests, selectedCategoryId, geek?.id);


			if (requestState?.requests?.length > 0) {
				
				const alreadyExists = seekerRequests?.some((request: ServiceRequest) => {
					return request?.category?._id === selectedCategoryId && request?.geek?._id === geek?.id && request?.geekResponseStatus === 'Pending';
				})
		
				if (alreadyExists) {
					toast.error('You already have a pending request for this category.');
					setIsLoading(false);
					return;
				}
			}
		
		dispatch(createRequest({
			category:selectedCategoryId,
			geek: geek?.id,
			issue: userIssue ? userIssue?.id : '',
			mode: userIssue?.modeOfService || "Online",
			location: {
				city: '',
				state: '',
				line1: '',
				line2: '',
				pin: '',
			},
		}));
	};

	const requestState = useSelector((state:RootState)=>state.request) as ServiceState;

	useEffect(()=>{
		if(requestState?.isRequestCreated && requestState?.request?._id){
			toast.success('Request created successfully');
		}
	},[requestState?.isRequestCreated, requestState?.request])


	useEffect(() => {
	const timeout = setTimeout(() => {
		bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
	}, 50); // small delay to allow rendering
	return () => clearTimeout(timeout);
	}, [messages]);


	useEffect(()=>{
		dispatch(getCategories());
		dispatch(getSeekerRequests());
	},[dispatch])

	const categories = useSelector((state: RootState) => state.category?.categories);





	const handleClearConversation = async () => {
		 if (!conversationId) {
			toast.error("Conversation ID not set");
			return;
		}

		try {
			console.log(conversationId);
			
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/chat/delete/${conversationId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setMessages([]);
				setFetchedChatHistory(false);
				toast.success('Chat history deleted successfully');
			} else {
				console.error('Failed to delete chat history',response);
			}
		} catch (error) {
			console.log('Error deleting chat history:', error);
			toast.error('Error deleting chat history:');
		}
	};

	const handleContinueChat = async () => {
		setFetchedChatHistory(true);
		if (ws.current && ws.current.readyState === WebSocket.CLOSED) {
			ws.current = new WebSocket(
				`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/chat/${userId}?conversation_id=${conversationId}`
			);
		}

		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			console.log('WebSocket connection opened to continue chat with agent.');
			setIsLoading(true);
			ws.current.send(
				JSON.stringify({
					action: 'continue_conversation',
					chat_history: messages.map((message) => ({
						role: message.role,
						message: message.content,
					})),
				})
			);
		}
		setFetchedChatHistory(false);
	};

	// useEffect(()=>{
	// 	const handlePageChange = async () => {
	// 		const response = await axios.post(
	// 			`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/geek_query/get_geeks_from_user_issue?page=${page}`,{
	// 				user_issue: userIssue
	// 			})
	// 			console.log(response);
				
	// 	}

	// 	handlePageChange();
		
		
	// },[page, userIssue])


	return (
		<section className="w-full h-full flex flex-col items-center">
  			<div className=" relative w-full mx-auto flex flex-col items-center rounded-md max-w-3xl p-3 h-full">
				<div className='py-10 absolute w-full top-0 left-0 h-24 gap-0.25 justify-center items-center  rounded-t-md bg-white border-b  text-lg font-bold text-gray-700 flex flex-col px-4'>

						<div className="flex gap-3  justify-end mt-2 mr-1 items-center  w-full text-sm">
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="hover:opacity-80 cursor-pointer  text-gray-800" 
							>
								{isExpanded ? <Minus />: <Maximize2 width={15} height={15} />}
							</button>

							
								<div>
									<CustomModel
									title='Are you sure you want to exit?'
									description='Your chat will end and you will be redirected to the home page.'
									isOpen={true}
									onOk={()=>{setOpenChat(false)}}
									onCancel={()=>{setOpenChat(true)}}
									toggleModal={()=>{}}
									setOpenModal={()=>{}}
									text='X'
									openModal={true}
								
								/>
								</div>
						</div>
					
					{user?.fullName?.first ?<p className={`mb-0 ${isExpanded ? 'text-lg md:text-xl' : 'text-sm'}`}>Welcome, {user?.fullName?.first + ' ' + user?.fullName?.last}</p> : <p className={`mb-0 ${isExpanded ? 'text-lg md:text-xl' : 'text-sm'}`}>Welcome to GoD Chatbot</p>}

					<p className={`  mb-0 text-xs  ${isExpanded ? 'font-medium' : 'font-normal'}`}>
						You are now connected to your GoD Chatbot.
					</p>

					<button
						onClick={handleClearConversation}
						className='flex  text-sm  font-semibold bg-transparent text-teal-600 cursor-pointer hover:text-teal-700  items-center w-fit px-3 py-1 rounded-md text-nowrap transition duration-150 transform hover:scale-105'>
						Clear Chat
					</button>

					
					
				</div>
				{!user?._id && error && (
						<div className=" flex flex-col items-center h-[80vh] justify-center text-center px-6">
							<p className="text-red-500 font-semibold mb-2">⚠ Chat Error</p>
							<p className="text-sm text-gray-600 mb-4">{error}</p>

							<button
							onClick={() => {setError(''); setIsLoading(true)}}
							className="px-4 py-2 bg-black text-white rounded-md hover:opacity-90"
							>
							Retry
							</button>
						</div>
						)}

						{!userId && (
						<div className=" flex flex-col items-center h-[80vh] justify-center text-center px-6">
								<p className="text-gray-700 font-semibold mb-2">Please log in to access the chat.</p>
								<button
								onClick={() => {
									window.location.href = '/login/seeker';
								}}
								className="px-4 py-2 bg-black text-white rounded-md hover:opacity-90"
								>
								Login
								</button>
						</div>
						)}

			
				<main className="flex flex-col flex-grow min-h-0 w-full overflow-y-auto custom-scrollbar">
      
					{userId && userId !== '' && messages.length === 0 && !isLoading ? (
						<div className="flex flex-grow items-center justify-center">
							<ChatWelcome
								onSuggestionClick={handleMessageSend}
								isLoadingAiResponse={isLoading}
								isExpanded={isExpanded}
							/>
						</div>
					) : (
						<div className='flex flex-col w-full  mt-28 py-5'>
							{messages.map((message: ChatMessageInterface, index) => (
								<ChatMessage isExpanded={isExpanded}  key={index} message={message} profileImage={user?.profileImage  ? user.profileImage  : "/assets/images/placeholder_user.jpg"} />
							))}

							{/* Loader */}
							{isLoading &&
								messages.length > 0 &&
								messages[messages.length - 1].role === 'user' && (
									<Image
										src={'/assets/gifs/loader.gif'}
										alt='loading'
										width={50}
										height={50}
									/>
								)}

						{fetchedChatHistory && (
							<div className='flex flex-col items-center mx-auto my-3 justify-center border border-teal-300 p-3 w-1/2'>
								<p className='font-bold text-xs md:text-sm mb-3'>Continue chat?</p>
								<div className='flex flex-row gap-x-6'>
									<button
										onClick={handleContinueChat}
										className='bg-teal-500 text-xs md:text-sm px-4 py-1 rounded-lg text-white border border-teal-500 hover:scale-105'>
										Yes
									</button>
									<button
										onClick={handleClearConversation}
										className=' px-4 text-xs md:text-sm py-1 rounded-lg border border-teal-500 hover:bg-teal-500 hover:text-white hover:scale-105'>
										No
									</button>
								</div>
							</div>
						)}



							{!isLoading && isGeekOption && geeks.length > 0 ? (
								<div className='flex flex-col gap-6 mt-8'>
									<div className='flex flex-wrap w-full justify-center'>
									{geeks?.map((geek, index) => (
										<GeekCard
											// className='m-2'
											key={index}
											geekData={geek}
											handleGeekCardClick={() => handleGeekCardClick(geek)}
										/>
									))}
								</div>

									<Pagination
									currentPage={page}
									totalPages={totalPages}
									onPageChange={()=>{setPage(page)}}
									/>

								</div>
							) : (
								<div>
									{!isLoading && options.length > 0 && (
										<div className='flex flex-wrap w-3/4'>
											{options.map((option, index) => (
												<ChatSuggestionButton
													key={index}
													prompt={option}
													onClick={handleMessageSend}
													isLoading={isLoading}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					)}
					<div className='h-0' ref={bottomRef} ></div>
				</main>
				{!error && userId && userId !== '' && (
					<div className='w-full static  bottom-0'>
						<ChatInput onSendMessage={handleMessageSend} isLoading={isLoading} />
					</div>
				)}
			</div>
		</section>
	);
}

export default Chat;
