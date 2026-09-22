export type SpeechOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
};

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

export function isSpeechSynthesisSupported() {
  return getSpeechSynthesis() !== null && typeof SpeechSynthesisUtterance !== "undefined";
}

export function stopSpeaking() {
  getSpeechSynthesis()?.cancel();
}

export function speakThai(text: string, options: SpeechOptions = {}) {
  const synthesis = getSpeechSynthesis();
  if (!synthesis || typeof SpeechSynthesisUtterance === "undefined") {
    throw new Error("TTS_NOT_SUPPORTED");
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "th-TH";
  utterance.rate = options.rate ?? 0.92;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 0.9;
  const voice = synthesis.getVoices().find((item) =>
    item.lang.toLowerCase().startsWith("th") && (!options.voiceName || item.name.toLowerCase().includes(options.voiceName.toLowerCase())),
  );
  if (voice) utterance.voice = voice;
  synthesis.cancel();
  synthesis.speak(utterance);
  return utterance;
}
