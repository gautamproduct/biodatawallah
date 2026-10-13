// Speak instead of type, using the phone's built-in speech recognition (Chrome on Android supports Hindi and Marathi).
import type { Lang } from './types';

type Recognition = {
  lang: string; interimResults: boolean; maxAlternatives: number;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: () => void; onend: () => void; start(): void; stop(): void;
};

const Ctor = (): (new () => Recognition) | undefined =>
  (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition
  ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;

export const voiceSupported = () => typeof window !== 'undefined' && !!Ctor();

const LOCALE: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

export function listen(lang: Lang, onText: (t: string) => void, onEnd: () => void): () => void {
  const C = Ctor();
  if (!C) { onEnd(); return () => {}; }
  const r = new C();
  r.lang = LOCALE[lang];
  r.interimResults = false;
  r.maxAlternatives = 1;
  r.onresult = (e) => onText(e.results[0][0].transcript);
  r.onerror = onEnd;
  r.onend = onEnd;
  r.start();
  return () => r.stop();
}
