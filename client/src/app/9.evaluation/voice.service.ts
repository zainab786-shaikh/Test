
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

@Injectable({ providedIn: 'root' })
export class VoiceService {

  private voiceSubject = new BehaviorSubject<SpeechSynthesisVoice | null>(null);
  selectedVoice$ = this.voiceSubject.asObservable();

  private recognition: any = null;
  private listening = false;

  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SR) {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;
    }

    this.ensureDefaultVoice();
  }

  private ensureDefaultVoice() {

    const setDefault = () => {
      if (this.voiceSubject.value) return;

      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voiceSubject.next(voices[0]);
      }
    };

    setDefault();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => setDefault();
    }
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.voiceSubject.next(voice);
  }

  speak(text: string, onEnd?: () => void) {

    const voice = this.voiceSubject.value;
    if (!voice) return;

    window.speechSynthesis.cancel();
    this.stopListening();

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;

    utter.onend = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utter);
  }

  stopSpeaking() {
    window.speechSynthesis.cancel();
    this.stopListening();
  }

  listen(callback: (heard: string) => void, timeout = 3000) {
    if (!this.recognition) return;

    window.speechSynthesis.cancel();
    this.stopListening();

    let finished = false;
    let finalTranscript = '';
    let interimTranscript = '';
    let silenceTimer: any;
    let sessionTimer: any;
    let restarting = false;

    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 400;

    const MAX_SESSION_TIME = 15000;
    const finish = (text: string) => {
      const cleaned = (text || '').trim();

      // 🚨 KEY CHANGE: don't finish if empty — retry instead
      if (!cleaned) {
        retry();
        return;
      }

      if (finished) return;
      finished = true;

      clearTimeout(silenceTimer);
      clearTimeout(sessionTimer);

      try { this.recognition.stop(); } catch {}

      this.listening = false;

      callback(cleaned);
    };

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        finish(finalTranscript || interimTranscript);
      }, timeout);
    };

    const safeStart = () => {
      if (restarting || finished) return;

      restarting = true;
      try { this.recognition.start(); } catch { }

      setTimeout(() => {
        restarting = false;
      }, 300);
    };

    const retry = () => {
      if (retryCount >= MAX_RETRIES || finished) {
        // Only now allow empty finish
        finished = true;
        callback((finalTranscript || interimTranscript || '').trim());
        return;
      }

      retryCount++;

      setTimeout(() => {
        safeStart();
      }, RETRY_DELAY);
    };


    this.recognition.onresult = (event: any) => {
      interimTranscript = '';
      retryCount = 0; // reset on success

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      resetSilenceTimer();
    };

    this.recognition.onerror = (event: any) => {
      const err = event.error;

      // Retry-friendly errors
      if (err === 'no-speech' || err === 'network' || err === 'audio-capture') {
        retry();
        return;
      }

      if (err === 'aborted') return;

      // Fatal errors
      finish(finalTranscript || interimTranscript);
    };

    this.recognition.onend = () => {
      if (!finished && this.listening) {
        retry();
      }
    };

    safeStart();
    this.listening = true;

    resetSilenceTimer();

    sessionTimer = setTimeout(() => {
      finish(finalTranscript || interimTranscript);
    }, MAX_SESSION_TIME);
  }

  private stopListening() {
    if (!this.recognition || !this.listening) return;

    try { this.recognition.stop(); } catch { }
    this.listening = false;
  }

}