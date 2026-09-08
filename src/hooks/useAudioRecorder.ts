import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const MIN_RECORDING_MS = 400;

export function useAudioRecorder(onTranscript: (text: string) => void) {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const startTimeRef = useRef<number>(0);
	const isStartingRef = useRef(false);
	const pendingStopRef = useRef(false);

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

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = async () => {
				const durationMs = Date.now() - startTimeRef.current;
				const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

				mediaRecorderRef.current = null;

				if (durationMs < MIN_RECORDING_MS || audioBlob.size === 0) {
					// Too short to contain usable audio — skip the round trip entirely.
					return;
				}

				const formData = new FormData();
				formData.append('file', audioBlob, 'recording.webm');

				try {
					const response = await axios.post(
						`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/stt`,
						formData,
						{ headers: { 'Content-Type': 'multipart/form-data' } }
					);
					if (response.data?.text) {
						onTranscript(response.data.text);
					}
				} catch (error) {
					console.error('STT ERROR: ', error);
				}
			};

			startTimeRef.current = Date.now();
			mediaRecorder.start();
			isStartingRef.current = false;
			setIsRecording(true);
		} catch (error) {
			console.error('Unable to access microphone: ', error);
			isStartingRef.current = false;
		}
	}, [onTranscript]);

	const stopRecording = useCallback(() => {
		if (isStartingRef.current && !mediaRecorderRef.current) {
			// Still waiting on getUserMedia — mark it to stop as soon as it's ready.
			pendingStopRef.current = true;
			return;
		}
		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== 'inactive') {
			recorder.stream.getTracks().forEach((track) => track.stop());
			recorder.stop();
		}
		setIsRecording(false);
	}, []);

	return { isRecording, startRecording, stopRecording };
}
