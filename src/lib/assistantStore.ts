import { useEffect, useState } from "react";

const KEY = "gre.assistant.open";

export function openAssistant() {
  window.dispatchEvent(new CustomEvent(KEY, { detail: true }));
}
export function closeAssistant() {
  window.dispatchEvent(new CustomEvent(KEY, { detail: false }));
}

export function useAssistant() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => setOpen((e as CustomEvent).detail);
    window.addEventListener(KEY, handler);
    return () => window.removeEventListener(KEY, handler);
  }, []);
  return { open, setOpen: (v: boolean) => window.dispatchEvent(new CustomEvent(KEY, { detail: v })) };
}
