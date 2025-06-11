export interface SpeechSettings {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private defaultSettings: SpeechSettings = {
    rate: 1,
    pitch: 1,
    volume: 0.8
  };

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
    
    // If voices aren't loaded yet, wait for the event
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = this.synth.getVoices();
      });
    }
  }

  speak(text: string, settings: SpeechSettings = {}) {
    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.rate = settings.rate || this.defaultSettings.rate!;
    utterance.pitch = settings.pitch || this.defaultSettings.pitch!;
    utterance.volume = settings.volume || this.defaultSettings.volume!;
    
    if (settings.voice) {
      utterance.voice = settings.voice;
    } else {
      // Try to find a pleasant voice
      const preferredVoice = this.voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Samantha')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();