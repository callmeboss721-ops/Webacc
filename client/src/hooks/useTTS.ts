import { useCallback, useEffect, useState } from "react";
import { isSpeechSynthesisSupported, speakThai, stopSpeaking } from "@/lib/tts";

export function useTTS() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported());
    return () => stopSpeaking();
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;
    const utterance = speakThai(text);
    setSpeaking(true);
    utterance.addEventListener("end", () => setSpeaking(false), { once: true });
    utterance.addEventListener("error", () => setSpeaking(false), { once: true });
  }, [supported]);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  return { supported, speaking, speak, stop };
}
