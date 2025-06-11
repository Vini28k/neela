import { speechSynthesisService, type SpeechSettings } from './audio/speechSynthesisService';

// Re-export the service and types for backward compatibility
export const textToSpeechService = speechSynthesisService;
export type { SpeechSettings };