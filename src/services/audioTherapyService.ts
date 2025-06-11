import { speechSynthesisService } from './audio/speechSynthesisService';

class AudioTherapyService {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  async speakText(text: string, options?: { rate?: number; volume?: number }) {
    try {
      if (speechSynthesisService.isSupported()) {
        speechSynthesisService.speak(text, {
          rate: options?.rate || 0.9,
          volume: options?.volume || 0.8
        });
      }
    } catch (error) {
      console.warn('Text-to-speech not available:', error);
    }
  }

  playCalming Sound(soundType: 'rain' | 'ocean' | 'forest' | 'white-noise' = 'rain') {
    try {
      // In a real app, you would load actual audio files
      // For now, we'll use the Web Audio API to generate simple tones
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different frequencies for different "sounds"
      const frequencies = {
        rain: 200,
        ocean: 150,
        forest: 300,
        'white-noise': 100
      };

      oscillator.frequency.setValueAtTime(frequencies[soundType], this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      oscillator.start();
      
      // Stop after 30 seconds
      setTimeout(() => {
        oscillator.stop();
      }, 30000);

    } catch (error) {
      console.warn('Audio playback not available:', error);
    }
  }

  stopAllSounds() {
    try {
      if (speechSynthesisService.isSupported()) {
        speechSynthesisService.stop();
      }
      
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
    } catch (error) {
      console.warn('Error stopping audio:', error);
    }
  }

  isAudioSupported(): boolean {
    return !!(this.audioContext || speechSynthesisService.isSupported());
  }
}

export const audioTherapyService = new AudioTherapyService();