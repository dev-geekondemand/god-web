import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

export function useTTS() {
	const [isVoiceLoading, setIsVoiceLoading] = useState(false);
	const [voiceError, setVoiceError] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const currentUrlRef = useRef<string | null>(null);
	const requestIdRef = useRef(0);

	useEffect(() => {
		const audio = new Audio();
		audioRef.current = audio;
		audioRef.current.preload = 'auto';
		audioRef.current.hidden = true;
		document.body.appendChild(audio);

		audio.onended = () => {
			setIsPlaying(false);
			setIsPaused(false);
			setPlayingMessageId(null);
		};

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				document.body.removeChild(audioRef.current);
			}
			if (currentUrlRef.current) {
				URL.revokeObjectURL(currentUrlRef.current);
			}
		};
	}, []);

	const speak = useCallback(async (text: string, messageId: string, voice: string = 'verse') => {
		// Every speak/cancel bumps this. An in-flight request whose token is no
		// longer current has been superseded and must stay silent.
		const requestId = ++requestIdRef.current;
		try {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}

			setIsPlaying(false);
			setIsPaused(false);
			setVoiceError(null);
			setPlayingMessageId(null);

			setIsVoiceLoading(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/tts`,
				{ text, voice },
				{ responseType: 'blob' }
			);

			// The audio for a message the user has already answered must never start
			// playing. cancel() (and any newer speak()) bumps the token while this
			// request is in flight, which lands us here.
			if (requestId !== requestIdRef.current) return;

			if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);

			const blob = response.data;
			const url = URL.createObjectURL(blob);
			currentUrlRef.current = url;

			const audio = audioRef.current;
			if (!audio) return;

			audio.pause();
			audio.src = url;
			audio.currentTime = 0;

			await audio.play();

			// play() is async too, so re-check before claiming the floor
			if (requestId !== requestIdRef.current) {
				audio.pause();
				audio.currentTime = 0;
				return;
			}

			setIsPlaying(true);
			setIsPaused(false);
			setPlayingMessageId(messageId);
		} catch (err) {
			if (requestId !== requestIdRef.current) return;
			setVoiceError(err instanceof Error ? err.message : 'Something went wrong with TTS');
			setPlayingMessageId(null);
		} finally {
			if (requestId === requestIdRef.current) setIsVoiceLoading(false);
		}
	}, []);

	const togglePauseResume = useCallback(() => {
		if (!audioRef.current) return;

		if (audioRef.current.paused) {
			audioRef.current.play();
			setIsPaused(false);
			setIsPlaying(true);
		} else {
			audioRef.current.pause();
			setIsPaused(true);
			setIsPlaying(false);
		}
	}, []);

	const cancel = useCallback(() => {
		// Invalidate any speak() still waiting on the network so it cannot start
		// talking over the user after they have already replied.
		requestIdRef.current += 1;
		setIsVoiceLoading(false);

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
		setIsPaused(false);
		setPlayingMessageId(null);
	}, []);

	return {
		speak,
		isVoiceLoading,
		voiceError,
		togglePauseResume,
		cancel,
		isPlaying,
		isPaused,
		playingMessageId,
	};
}
