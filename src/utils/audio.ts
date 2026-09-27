/**
 * Audio synthesis and text-to-speech engine for MoraKids
 * Uses Web Audio API for zero-latency, high-quality pleasant sound effects
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Check localStorage if user preferred mute
    const stored = localStorage.getItem('morakids_sound_enabled');
    if (stored !== null) {
      this.soundEnabled = stored === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return !this.soundEnabled;
  }

  public toggleMute(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('morakids_sound_enabled', String(this.soundEnabled));
    return this.soundEnabled;
  }

  /**
   * Play single synthesized musical tone
   */
  public playNote(frequency: number, type: OscillatorType = 'sine', duration: number = 0.35, gainValue: number = 0.2) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  /**
   * Cheerful success chime
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 'triangle', 0.28, 0.25);
      }, idx * 75);
    });
  }

  /**
   * Pleasant bubble click/pop
   */
  public playPop() {
    if (!this.soundEnabled) return;
    this.playNote(420, 'sine', 0.12, 0.2);
  }

  /**
   * Cheerful fanfare when winning or completing a game
   */
  public playFanfare() {
    if (!this.soundEnabled) return;
    const fanfareNotes = [
      { f: 523.25, d: 100 }, // C5
      { f: 659.25, d: 100 }, // E5
      { f: 783.99, d: 120 }, // G5
      { f: 1046.50, d: 350 }, // C6
      { f: 880.00, d: 120 },  // A5
      { f: 1046.50, d: 450 }, // C6
    ];

    let delay = 0;
    fanfareNotes.forEach((item) => {
      setTimeout(() => {
        this.playNote(item.f, 'triangle', item.d / 1000 + 0.1, 0.28);
      }, delay);
      delay += item.d + 30;
    });
  }

  /**
   * Gentle boing tone for soft misses
   */
  public playGentleBoing() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  /**
   * Speak text aloud using web speech synthesis with clear kid-friendly pronunciation
   * Automatically detects Arabic or Indonesian/English text
   */
  public speak(text: string, rate: number = 0.88, pitch: number = 1.0, forcedLang?: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      const hasArabic = /[\u0600-\u06FF]/.test(text);
      utterance.lang = forcedLang || (hasArabic ? 'ar-SA' : 'id-ID');

      if (hasArabic) {
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find((v) => v.lang.startsWith('ar'));
        if (arVoice) utterance.voice = arVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis may be restricted until user gesture
    }
  }
}

export const sound = new SoundEngine();
