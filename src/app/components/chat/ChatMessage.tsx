// import TimeDisplay from '../TimeFormat';
'use client';

import { ChatMessageInterface } from '@/interfaces/Chat';
import Image from 'next/image';
import { Play, Pause, XCircle, Mic, RotateCcw } from 'lucide-react';

function TimeDisplay({ timestamp }: { timestamp: number }) {
	const date = new Date(timestamp);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const formattedTime = `${hours}:${minutes}`;

	return <span>{formattedTime}</span>;
}

interface ChatMessageProps {
	message: ChatMessageInterface;
	key: number;
	profileImage:string
	isExpanded: boolean;
	playingMessageId: string | null;
	isPlaying: boolean;
	isPaused: boolean;
	speak: (text: string, messageId: string, voice?: string) => void;
	togglePauseResume: () => void;
	cancel: () => void;
	/** Supplied only for the latest voice message, which is the only one safe to rewind to. */
	onReRecord?: () => void;
	isReRecording?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	message,
	profileImage,
	isExpanded,
	playingMessageId,
	isPlaying,
	isPaused,
	speak,
	togglePauseResume,
	cancel,
	onReRecord,
	isReRecording = false,
}) => {
	const isUser = message.role === 'user';
	const isActive = playingMessageId === message.id;
	const isVoice = isUser && message.source === 'voice';

	const bgColor = isUser
		? 'bg-teal-500'
		: 'bg-gradient-to-br from-gray-50 to-gray-200';
	const textColor = isUser ? 'text-white' : 'text-black';
	const alignment = isUser ? 'justify-end' : 'justify-start';
	const timeColor = isUser ? 'text-white' : 'text-gray-800';
	const corner = isUser ? 'rounded-tr-none' : 'rounded-tl-none';

	const iconSize = isExpanded ? 16 : 14;

	const handlePlayPause = () => {
		if (isActive) {
			togglePauseResume();
		} else {
			speak(message.content, message.id);
		}
	};

	return (
		<div className={` flex ${alignment} items-start`}>
			{!isUser && (
				<div
					className={` my-2 flex items-center justify-center font-bold ${textColor}`}>
					<Image width={isExpanded ? 40 : 20} height={isExpanded ? 40 : 20} className=' rounded-full object-cover border border-black' src={'/assets/images/robot-assistant.png'} alt='bot' />
				</div>
			)}
			<div
				className={`${bgColor} ${textColor} ${corner}
				text-xs font-medium ${isExpanded ? "sm:text-sm px-6 py-2" :"text-xs px-3 py-1"} rounded-2xl    m-2 flex ${isExpanded ? "max-w-xs sm:max-w-fit md:max-w-1/2":"max-w-2/3"} shadow-md flex-col`}>
				{isVoice && (
					<div className='mt-1 flex items-center gap-1 self-start rounded-full bg-white/20 px-1.5 py-0.5'>
						<Mic size={10} />
						<span className='text-[10px] font-semibold leading-none'>Voice</span>
					</div>
				)}
				<div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
				<div className={`${timeColor} text-xs  my-1 flex items-center justify-between gap-3`}>
					{onReRecord ? (
						// A wrong transcript is far easier to re-speak than to retype, so the
						// fix lives on the bubble itself rather than behind the composer.
						<button
							type='button'
							onClick={onReRecord}
							title={isReRecording ? 'Tap to stop recording' : 'Re-record this message'}
							className='flex items-center gap-1 text-[10px] font-semibold underline decoration-white/50 underline-offset-2 opacity-90 hover:opacity-100'>
							{isReRecording ? (
								<>
									<span className='h-1.5 w-1.5 rounded-full bg-red-300 animate-pulse' />
									Listening… tap to stop
								</>
							) : (
								<>
									<RotateCcw size={10} />
									Wrong? Re-record
								</>
							)}
						</button>
					) : (
						<span />
					)}
					<TimeDisplay timestamp={message.timestamp} />
				</div>
			</div>
			{!isUser && (
				<div className='flex flex-row gap-1 text-teal-500 items-center my-auto'>
					<button
						onClick={handlePlayPause}
						className='p-1 rounded-full hover:bg-teal-50'
						aria-label={isActive && isPlaying ? 'Pause' : isActive && isPaused ? 'Resume' : 'Play'}>
						{isActive && isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
					</button>
					{isActive && (
						<button onClick={cancel} className='p-1 rounded-full hover:bg-teal-50' aria-label='Stop'>
							<XCircle size={iconSize} />
						</button>
					)}
				</div>
			)}
			{isUser && (
				<div
					className={`${isExpanded ? 'w-10 h-10' : 'w-7 h-7'} my-2 rounded-full ${bgColor} flex items-center justify-center font-bold ${textColor}`}>
					<Image

					width={isExpanded ? 20 : 10}
					height={isExpanded ? 20 : 10}
					src={profileImage ? profileImage : "/assets/images/placeholder_user.jpg"}
					alt='user'
					className='w-full h-full object-cover rounded-full'
					/>
				</div>
			)}
		</div>
	);
};

export default ChatMessage;
