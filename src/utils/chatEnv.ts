// One source tree serves two deployments: a push to master runs both
// master_god-test-frontend.yml (god-test-frontend) and master_god-web.yml
// (god-web). So the chatbot host must not be baked to one environment's
// variable name - each deployment supplies the canonical pair below and gets
// its own backend.
//
// The _TEST names are still honoured as a fallback so an environment that is
// only configured the old way keeps working instead of going dark.
//
// NEXT_PUBLIC_* is inlined at build time, so a name that is not set at build
// time becomes the literal string "undefined" rather than undefined - which is
// how we previously ended up requesting "<origin>/undefined/chat/...". Treat
// that string as unset.
const firstConfigured = (...values: Array<string | undefined>): string =>
	values.find((value) => !!value && value !== 'undefined') ?? '';

/** Base HTTPS origin of the chatbot API (chat history, tts, stt, geek paging). */
export const CHAT_SERVER_URL = firstConfigured(
	process.env.NEXT_PUBLIC_BASE_SERVER_URL,
	process.env.NEXT_PUBLIC_BASE_SERVER_URL_TEST
);

/** WebSocket base for the Gnie chat socket, including the trailing /chat/. */
export const CHAT_WEBSOCKET_URL = firstConfigured(
	process.env.NEXT_PUBLIC_WEBSOCKET_URL,
	process.env.NEXT_PUBLIC_WEBSOCKET_URL_TEST
);

/** Full URL of the chatbot's service-categories endpoint (the welcome prompts). */
export const CHAT_CATEGORIES_URL = firstConfigured(
	process.env.NEXT_PUBLIC_SERVER_URL,
	process.env.NEXT_PUBLIC_SERVER_URL_TEST
);
