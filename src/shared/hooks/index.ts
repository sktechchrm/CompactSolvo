import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

export function useToggle(initial = false): [boolean, () => void, { setOn:()=>void; setOff:()=>void }] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setOn   = useCallback(() => setValue(true), []);
  const setOff  = useCallback(() => setValue(false), []);
  return [value, toggle, { setOn, setOff }];
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current;
}

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, handler: (e: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => { if (!ref.current || ref.current.contains(e.target as Node)) return; handler(e); };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => { document.removeEventListener('mousedown', listener); document.removeEventListener('touchstart', listener); };
  }, [ref, handler]);
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((val: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => { try { const i = localStorage.getItem(key); return i ? JSON.parse(i) as T : initialValue; } catch { return initialValue; } });
  const setValue = useCallback((v: T | ((val: T) => T)) => {
    try { const n = v instanceof Function ? v(stored) : v; setStored(n); localStorage.setItem(key, JSON.stringify(n)); } catch { /* noop */ }
  }, [key, stored]);
  return [stored, setValue];
}

export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = useCallback(async (text: string): Promise<boolean> => {
    try { await navigator.clipboard.writeText(text); setCopied(true); clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setCopied(false), resetAfter); return true; } catch { return false; }
  }, [resetAfter]);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return { copy, copied };
}

export function useIsMobile(bp = 768): boolean {
  const [is, setIs] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => {
    const obs = new ResizeObserver(() => setIs(window.innerWidth < bp));
    obs.observe(document.documentElement);
    return () => obs.disconnect();
  }, [bp]);
  return is;
}
