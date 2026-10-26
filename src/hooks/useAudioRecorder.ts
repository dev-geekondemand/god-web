import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

interface UseAudioRecorderOptions {
	onTranscript: (text: string) => void;
	onError?: (message: string) => void;
}

const MIN_RECORDING_MS = 400; // ignore accidental taps that are too short to contain speech
const MAX_RECORDING_MS = 60000; // safety cap so a stuck/forgotten recording doesn't run forever

// Safari/iOS don't support webm at all, so fall back through the formats a
// browser is actually willing to encode instead of assuming webm/opus.
const MIME_CANDIDATES = [
	'audio/webm;codecs=opus',
	'audio/webm',
	'audio/mp4',
	'audio/ogg;codecs=opus',
];

function pickSupportedMimeType(): string | undefined {
	if (typeof MediaRecorder === 'undefined') return undefined;
	return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported?.(type));
}

function extensionFor(mimeType: string): string {
	if (mimeType.includes('mp4')) return 'm4a';
	if (mimeType.includes('ogg')) return 'ogg';
	return 'webm';
}

export function useAudioRecorder({ onTranscript, onError }: UseAudioRecorderOptions) {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const startTimeRef = useRef<number>(0);
	const isStartingRef = useRef(false);
	const pendingStopRef = useRef(false);
	const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const stopRecording = useCallback(() => {
		if (isStartingRef.current && !mediaRecorderRef.current) {
			// Still waiting on getUserMedia — mark it to stop as soon as it's ready.
			pendingStopRef.current = true;
			return;
		}
		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== 'inactive') {
			recorder.stop();
		}
		setIsRecording(false);
	}, []);

	const startRecording = useCallback(async () => {
		if (isStartingRef.current || mediaRecorderRef.current) {
			// Already recording (or in the process of starting) — ignore duplicate calls,
			// e.g. from a touch device firing both touch and synthetic mouse events.
			return;
		}
		isStartingRef.current = true;
		pendingStopRef.current = false;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			if (pendingStopRef.current) {
				// stopRecording() was already called while we were waiting for mic permission.
				stream.getTracks().forEach((track) => track.stop());
				isStartingRef.current = false;
				pendingStopRef.current = false;
				return;
			}

			const mimeType = pickSupportedMimeType();
			const mediaRecorder = mimeType
				? new MediaRecorder(stream, { mimeType })
				: new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = async () => {
				stream.getTracks().forEach((track) => track.stop());
				mediaRecorderRef.current = null;
				setIsRecording(false);
				if (maxDurationTimerRef.current) {
					clearTimeout(maxDurationTimerRef.current);
					maxDurationTimerRef.current = null;
				}

				const durationMs = Date.now() - startTimeRef.current;
				const actualMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
				const audioBlob = new Blob(chunksRef.current, { type: actualMimeType });

				// Too short to be real speech — likely an accidental tap, ignore quietly.
				if (audioBlob.size === 0 || durationMs < MIN_RECORDING_MS) return;

				setIsTranscribing(true);
				const formData = new FormData();
				formData.append('file', audioBlob, `recording.${extensionFor(actualMimeType)}`);

				try {
					const response = await axios.post(
						`${process.env.NEXT_PUBLIC_BASE_SERVER_URL_TEST}/stt`,
						formData,
						{ headers: { 'Content-Type': 'multipart/form-data' } }
					);
					const text = (response.data?.text ?? '').trim();
					if (text) {
						onTranscript(text);
					} else {
						onError?.('Could not hear anything. Please try again.');
					}
				} catch (error) {
					console.error('STT ERROR: ', error);
					onError?.('Could not process your voice. Please try again.');
				} finally {
					setIsTranscribing(false);
				}
			};

			startTimeRef.current = Date.now();
			mediaRecorder.start(1000);
			isStartingRef.current = false;
			setIsRecording(true);
			maxDurationTimerRef.current = setTimeout(stopRecording, MAX_RECORDING_MS);
		} catch (error) {
			console.error('Microphone access error: ', error);
			isStartingRef.current = false;
			onError?.('Microphone access is required for voice input.');
		}
	}, [onTranscript, onError, stopRecording]);

	return { isRecording, isTranscribing, startRecording, stopRecording };
}
