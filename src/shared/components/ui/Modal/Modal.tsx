import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useFocusTrap } from '../../../../hooks/useFocusTrap';
import { cn } from '../../../utils/cn';

const SIZE = { sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl', full:'max-w-none mx-4 md:mx-8' } as const;

export interface ModalProps {
  open: boolean; onClose: () => void; title: string; description?: string;
  children: React.ReactNode; size?: keyof typeof SIZE;
  closeOnBackdrop?: boolean; showCloseButton?: boolean; className?: string;
}

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

export function Modal({ open, onClose, title, description, children, size='md', closeOnBackdrop=true, showCloseButton=true, className }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId(); const descId = useId();
  useFocusTrap(ref, open);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    document.addEventListener('keydown', h, true);
    return () => document.removeEventListener('keydown', h, true);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true">
          <motion.div key="panel" ref={ref} role="dialog" aria-modal="true"
            aria-labelledby={titleId} aria-describedby={description ? descId : undefined}
            initial={{opacity:0,scale:0.96,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.96,y:8}}
            transition={{duration:0.18,ease:[0.16,1,0.3,1]}} onClick={(e) => e.stopPropagation()}
            className={cn('w-full bg-surface dark:bg-surface-2 rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh]', SIZE[size], className)}>
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-content leading-snug">{title}</h2>
                {description && <p id={descId} className="mt-1 text-sm text-content-secondary">{description}</p>}
              </div>
              {showCloseButton && (
                <button type="button" onClick={onClose} aria-label="Close dialog"
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-content-secondary hover:bg-surface-secondary hover:text-content transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  <FaTimes aria-hidden className="text-sm" />
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

Modal.Footer = function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0', className)}>{children}</div>;
};
