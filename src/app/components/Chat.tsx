'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import { useRouter } from 'next/navigation';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';

// import loader from '/assets/gifs/loader.gif';
import ChatWelcome from './chat/ChatWelcome';
import ChatSuggestionButton from './chat/ChatSuggestionButton';
import GeekCard from './GeekCard';
import   { Address, GeekData } from '@/interfaces/Geek';
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
import { createRequest, getSeekerRequests } from '@/features/request/requestSlice';
import { ServiceRequest } from '@/interfaces/ServiceRequest';
import { Maximize2, Minus } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

interface GeekOptionsPayload {
	geeks: GeekData[];
	page: number;
	pages: number;
	userIssue?: UserIssue;
}

// The geek list rides along inside the socket frame's `options[0]`, which is a
// JSON string on some backend paths and an already-parsed object on others.
// Anything unreadable comes back as null instead of throwing, so a malformed
// frame degrades into an error panel rather than taking out the whole handler.
const parseGeekOptions = (options: unknown): GeekOptionsPayload | null => {
	if (!Array.isArray(options) || options.length === 0) return null;

	let parsed: unknown = options[0];
	if (typeof parsed === 'string') {
		try {
			parsed = JSON.parse(parsed);
		} catch {
			return null;
		}
	}
	if (!parsed || typeof parsed !== 'object') return null;

	const payload = parsed as Record<string, unknown>;
	if (!Array.isArray(payload.geeks)) return null;

	const toPositiveInt = (value: unknown, fallback: number) => {
		const parsedNumber = Number(value);
		return Number.isFinite(parsedNumber) && parsedNumber > 0 ? Math.floor(parsedNumber) : fallback;
	};

	return {
		geeks: payload.geeks as GeekData[],
		page: toPositiveInt(payload.page, 1),
		pages: toPositiveInt(payload.pages, 1),
		userIssue: (payload.user_issue as UserIssue) ?? undefined,
	};
};

function Chat({setOpenChat, isExpanded, setIsExpanded}:{setOpenChat: (value: boolean)=>void, isExpanded: boolean, setIsExpanded: (value: boolean)=>void}): JSX.Element {
	const router = useRouter();
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
	const [sentRequest, setSentRequest] = useState(false);
	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const [geeksError, setGeeksError] = useState<string | null>(null);
	const [isGeeksLoading, setIsGeeksLoading] = useState(false);
	const [geeksReloadKey, setGeeksReloadKey] = useState(0);
	const [reconnectKey, setReconnectKey] = useState(0);

	const tts = useTTS();
	const skipPageFetchRef = useRef(true);

	const ws = useRef<WebSocket | null>(null);
	const pendingMessageRef = useRef<string | null>(null);


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
						`${process.env.NEXT_PUBLIC_BASE_SERVER_URL_TEST}/chat/chat_history/${conversationId}`,
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
					// A missing history is not fatal — the seeker can still start a new
					// chat, so warn without blocking the whole surface behind the error panel.
					console.error('Could not load chat history:', error);
					toast.error('Could not load your previous chat. You can still start a new one.');
				}

		};
		if (userId) {
			if (messages.length <= 0) {
				getChatHistory();
			}
		}
	}, [conversationId, messages.length, userId]);

	

	// Never let a TTS problem abort the onmessage handler — everything after it
	// (the geek list parsing) lives in the same try block.
	const handleSpeak = (text: string, messageId: string) => {
		try {
			if (typeof text === 'string' && text.trim()) {
				tts.speak(text, messageId);
			}
		} catch (error) {
			console.error('TTS error:', error);
		}
	};

	// The socket takes a moment to connect after a fresh page load/new chat.
	// Sending immediately would silently drop the message (readyState isn't
	// OPEN yet) and leave the loader stuck forever with no server reply ever
	// coming — so queue it and flush once the socket actually opens instead.
	const sendWhenReady = (payload: string) => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(payload);
		} else if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
			pendingMessageRef.current = payload;
		} else {
			setIsLoading(false);
			toast.error('Connection lost. Please try sending your message again.');
		}
	};

	// Wires up every handler a chat socket needs. Used both for the initial
	// connection and whenever handleContinueChat has to reconnect a closed
	// socket — a socket with only `onopen` attached would silently drop every
	// reply from the server.
	const attachSocketHandlers = (socket: WebSocket) => {
			socket.onopen = () => {
				console.log('WebSocket connection opened');
				if (pendingMessageRef.current) {
					socket.send(pendingMessageRef.current);
					pendingMessageRef.current = null;
				}
			};

			socket.onmessage = (event) => {
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
					handleSpeak(response, botMessage.id);
					if (response === 'Please select a Geek to proceed') {
						const geekOptions = parseGeekOptions(options);

						if (!geekOptions) {
							// The frame said "pick a Geek" but carried no readable list.
							// Show the bot's message with an inline error instead of a
							// dead end, and keep the composer usable.
							console.error('Unreadable geek payload on socket frame:', options);
							setGeeks([]);
							setOptions([]);
							setIsGeekOption(true);
							setGeeksError('We could not load the list of Geeks for your issue.');
							setIsLoading(false);
							return;
						}

						skipPageFetchRef.current = true;
						setGeeksError(
							geekOptions.geeks.length === 0
								? 'No Geeks are available for this issue right now.'
								: null
						);
						setPage(geekOptions.page);
						setTotalPages(geekOptions.pages);
						setUserIssue(geekOptions.userIssue);
						setGeeks(geekOptions.geeks);
						setIsGeekOption(true);
						setSentRequest(false);
					} else {
						setGeeks([]);
						setGeeksError(null);
						setIsGeekOption(false);
						setOptions(Array.isArray(options) ? options : []);
					}
					setIsLoading(false);
				} catch (error) {
					console.error('Failed to handle socket frame:', error);
					toast.error('Something went wrong. Please try again.');
					setIsLoading(false);
					setOptions([]);
					setGeeks([]);
					setGeeksError(null);
					setIsGeekOption(false);
				}


			};

			socket.onclose = () => {
				console.log('WebSocket connection closed');
				setIsLoading(false);
			};

			socket.onerror = () => {
				setError(
					"Chat service is currently unavailable. Please try again later."
					);
				setIsLoading(false);
			};
	};

	useEffect(() => {
		if (!userId) {
			return;
		}

		let socket: WebSocket;
		try {
			socket = new WebSocket(
				`${process.env.NEXT_PUBLIC_WEBSOCKET_URL_TEST}${userId}?conversation_id=${conversationId}`
			);
		} catch (error) {
			// A malformed/missing NEXT_PUBLIC_WEBSOCKET_URL throws right here
			console.error('Could not open chat socket:', error);
			setError('Chat service is currently unavailable. Please try again later.');
			return;
		}

		ws.current = socket;
		attachSocketHandlers(socket);

		return () => {
			pendingMessageRef.current = null;
			// Detach first: a socket torn down mid-connect would otherwise fire
			// onclose/onerror and push state into an unmounted or superseded chat.
			socket.onopen = null;
			socket.onmessage = null;
			socket.onclose = null;
			socket.onerror = null;
			if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
				socket.close();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationId, userId, reconnectKey]);



	const handleMessageSend = async (content: string) => {
		if (!userId || userId === '') {
			toast.error('User not found');
			return;
		}
		if (!content || !content.trim()) {
			return;
		}

		// The moment the seeker answers — typed, spoken, or by tapping a suggested
		// reply — stop reading the previous bot message out loud.
		tts.cancel();
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

		
		setIsLoading(true);
		textBufferRef.current = '';
		setOptions([]);

		try {
			sendWhenReady(content);
		}catch (error) {
			console.error('Error sending message:', error);
			setError("Failed to send message. Please try again.");
			setIsLoading(false);
		}

	};


	// An offline job sends a geek to a doorstep, so it needs a real street address. Prefer the
	// seeker's saved one; otherwise ask for location permission and reverse geocode the fix.
	// Returns null when we could not establish an address the backend will accept.
	const resolveOfflineAddress = async (): Promise<Address | null> => {
		if (user?.address?.line1) return user.address;

		if (typeof navigator === 'undefined' || !navigator.geolocation) return null;

		let position: GeolocationPosition;
		try {
			position = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0,
				});
			});
		} catch {
			// permission denied, position unavailable, or timed out
			return null;
		}

		const { latitude, longitude } = position.coords;

		try {
			const res = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
			);
			const data = await res.json();

			const place =
				data?.features?.find((f: { place_type?: string[] }) => f.place_type?.includes('address')) ||
				data?.features?.[0];
			if (!place) return null;

			const contextValue = (type: string) =>
				place.context?.find((c: { id: string; text: string }) => c.id.includes(type))?.text || '';

			// line1 is the one field the backend requires; without it there is no usable address
			const line1 =
				[place.address, place.text].filter(Boolean).join(' ').trim() ||
				place.place_name?.split(',')[0]?.trim() ||
				'';
			if (!line1) return null;

			return {
				line1,
				line2: '',
				line3: undefined,
				city: contextValue('place'),
				state: contextValue('region'),
				country: contextValue('country'),
				pin: contextValue('postcode'),
				location: { type: 'Point', coordinates: [longitude, latitude] },
			};
		} catch {
			return null;
		}
	};

	const handleGeekCardClick = async (geek: GeekData) => {
		if (isSendingRequest) return;

		// Picking a Geek is an answer too — silence the bot before acting on it.
		tts.cancel();

		let selectedCategoryId = '';
		if (userIssue !== null) {
			const category = categories?.find((value: object): value is Category => {
				return value && 'title' in value && value.title === (userIssue as UserIssue)?.category_details?.category;
			});

			if(category?._id){
				selectedCategoryId = category._id;
			}
		}

		if (!selectedCategoryId) {
			toast.error('We could not match this issue to a service category. Please try again.');
			return;
		}

		const alreadyExists = seekerRequests?.some((request: ServiceRequest) => {
			return request?.category?._id === selectedCategoryId && request?.geek?._id === geek?._id && request?.geekResponseStatus === 'Pending';
		});

		if (alreadyExists) {
			toast.error('You already have a pending request for this category.');
			return;
		}

		const mode = userIssue?.modeOfService || 'Online';

		// Default to the seeker's saved address; the backend falls back to it anyway
		let requestAddress: Address | { city: string; state: string; line1: string } =
			user?.address?.line1 ? user.address : { city: '', state: '', line1: '' };

		setIsSendingRequest(true);

		if (mode === 'Offline') {
			const resolved = await resolveOfflineAddress();

			if (!resolved) {
				setIsSendingRequest(false);
				toast.error('We need your address for an on-site visit. Please add it to your profile.');
				if (userId) router.push(`/seeker/${userId}/add-address`);
				return;
			}

			requestAddress = resolved;
		}

		try {
			const result = await dispatch(createRequest({
				category: selectedCategoryId,
				geek: geek?._id,
				issue: userIssue?.id || '',
				mode,
				brand: userIssue?.device_details?.brand,
				location: requestAddress,
			}));

			// Only show the confirmation panel once the backend has actually accepted the request
			if (createRequest.fulfilled.match(result)) {
				setSentRequest(true);
				setGeeksError(null);
				dispatch(getSeekerRequests());
			} else {
				toast.error('We could not send your request. Please try again.');
			}
		} catch (error) {
			console.error('Error creating request:', error);
			toast.error('We could not send your request. Please try again.');
		} finally {
			setIsSendingRequest(false);
		}
	};

	// The success toast is raised by the request slice; toasting here too would double it up


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
				`${process.env.NEXT_PUBLIC_BASE_SERVER_URL_TEST}/chat/delete/${conversationId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				// Reset every derived panel too, otherwise a stale geek list and its
				// pager survive a cleared conversation.
				setMessages([]);
				setFetchedChatHistory(false);
				setOptions([]);
				setGeeks([]);
				setIsGeekOption(false);
				setGeeksError(null);
				setUserIssue(undefined);
				setSentRequest(false);
				setPage(1);
				setTotalPages(1);
				skipPageFetchRef.current = true;
				tts.cancel();
				toast.success('Chat history deleted successfully');
			} else {
				console.error('Failed to delete chat history',response);
				toast.error('Could not clear the chat. Please try again.');
			}
		} catch (error) {
			console.log('Error deleting chat history:', error);
			toast.error('Error deleting chat history');
		}
	};

	const handleContinueChat = async () => {
		setFetchedChatHistory(true);
		if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
			ws.current = new WebSocket(
				`${process.env.NEXT_PUBLIC_WEBSOCKET_URL_TEST}${userId}?conversation_id=${conversationId}`
			);
			attachSocketHandlers(ws.current);
		}

		setIsLoading(true);
		sendWhenReady(
			JSON.stringify({
				action: 'continue_conversation',
				chat_history: messages.map((message) => ({
					role: message.role,
					message: message.content,
				})),
			})
		);
		setFetchedChatHistory(false);
	};

	useEffect(() => {
		if (!isGeekOption) {
			return;
		}

		// Consume the skip flag before any other bail-out: the current page's Geeks
		// already arrived inside the socket frame. Returning ahead of this (which a
		// missing user_issue used to do) left the flag latched true forever and
		// silently killed every later page fetch.
		if (skipPageFetchRef.current) {
			skipPageFetchRef.current = false;
			return;
		}

		if (!userIssue) {
			setGeeksError('We cannot load more Geeks because the issue details are missing.');
			return;
		}

		let cancelled = false;

		const fetchGeeksForPage = async () => {
			setIsGeeksLoading(true);
			setGeeksError(null);
			try {
				const { data } = await axios.post(
					`${process.env.NEXT_PUBLIC_BASE_SERVER_URL_TEST}/geek_query/get_geeks_from_user_issue?page=${page}`,
					userIssue
				);
				if (cancelled) return;
				if (data?.error) {
					throw new Error(data.error);
				}

				const nextGeeks = Array.isArray(data?.geeks) ? (data.geeks as GeekData[]) : [];
				setGeeks(nextGeeks);

				const nextPages = Number(data?.pages);
				if (Number.isFinite(nextPages) && nextPages > 0) {
					setTotalPages(Math.floor(nextPages));
				}
				if (nextGeeks.length === 0) {
					setGeeksError('No Geeks found on this page.');
				}
			} catch (error) {
				if (cancelled) return;
				console.error('Error fetching geeks for page:', error);
				setGeeks([]);
				setGeeksError('Failed to load Geeks for this page.');
			} finally {
				if (!cancelled) setIsGeeksLoading(false);
			}
		};

		fetchGeeksForPage();

		// A fast click through pages must not let an earlier response overwrite a later one
		return () => {
			cancelled = true;
		};
	}, [page, isGeekOption, userIssue, geeksReloadKey]);


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
				{error && (
						// Previously gated on `!user?._id`, so a signed-in seeker whose socket
						// failed saw no error at all — and the composer below hides on `error`,
						// leaving a chat with no way out. Now it always renders, and Retry
						// actually re-opens the socket instead of just spinning the loader.
						<div className=" flex flex-col items-center h-[80vh] justify-center text-center px-6">
							<p className="text-red-500 font-semibold mb-2">⚠ Chat Error</p>
							<p className="text-sm text-gray-600 mb-4">{error}</p>

							<button
							onClick={() => {
								setError(null);
								setIsLoading(false);
								setReconnectKey((key) => key + 1);
							}}
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
									router.push('/login/seeker');
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
								<ChatMessage
									isExpanded={isExpanded}
									key={index}
									message={message}
									profileImage={user?.profileImage  ? user.profileImage  : "/assets/images/placeholder_user.jpg"}
									playingMessageId={tts.playingMessageId}
									isPlaying={tts.isPlaying}
									isPaused={tts.isPaused}
									speak={tts.speak}
									togglePauseResume={tts.togglePauseResume}
									cancel={tts.cancel}
								/>
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
							<div className='flex flex-col items-center mx-auto my-3 justify-center border border-teal-300 p-3 w-11/12 max-w-xs sm:w-1/2'>
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



							{!isLoading && isGeekOption ? (
								<div className='flex flex-col gap-4 mt-8 w-full min-w-0'>
									{sentRequest ? (
										// Once the request is accepted the list is gone, so the pager
										// that used to page it must go with it.
										<p className='text-center text-green-600 font-semibold text-xs md:text-sm px-3'>
											Your request has been sent to the selected Geek. They will get back to
											you soon.
										</p>
									) : (
										<>
											{isGeeksLoading && (
												<p className='text-center text-xs md:text-sm text-gray-500'>
													Loading Geeks…
												</p>
											)}

											{!isGeeksLoading && geeksError && (
												<div className='mx-auto flex w-full max-w-sm flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center'>
													<p className='text-xs md:text-sm text-red-600'>{geeksError}</p>
													{userIssue && (
														<button
															onClick={() => setGeeksReloadKey((key) => key + 1)}
															className='rounded-md bg-teal-500 px-3 py-1 text-xs font-medium text-white hover:bg-teal-600'>
															Try again
														</button>
													)}
												</div>
											)}

											{!isGeeksLoading && geeks?.length > 0 && (
												<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0 px-1'>
													{geeks.map((geek, index) => (
														<GeekCard
															key={geek?._id ?? index}
															geekData={geek}
															isSubmitting={isSendingRequest}
															handleGeekCardClick={() => handleGeekCardClick(geek)}
														/>
													))}
												</div>
											)}

											{!isGeeksLoading && userIssue && totalPages > 1 && (
												<Pagination
													currentPage={page}
													totalPages={totalPages}
													onPageChange={(newPage: number) => {
														if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
													}}
												/>
											)}
										</>
									)}
								</div>
							) : (
								<div>
									{!isLoading && options.length > 0 && (
										<div className='flex flex-wrap w-full px-2 sm:w-3/4'>
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
						<ChatInput onSendMessage={handleMessageSend} isLoading={isLoading} onStartRecording={tts.cancel} />
					</div>
				)}
			</div>
		</section>
	);
}

export default Chat;
