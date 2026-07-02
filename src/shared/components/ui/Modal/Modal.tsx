import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useFocusTrap } from '../../../../hooks/useFocusTrap';
import { cn } from '../../../utils/cn';

const SIZE = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-none mx-4 md:mx-8',
} as const;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: keyof typeof SIZE;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

const CSS = `
  @keyframes modal-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modal-panel-in { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-backdrop { animation: modal-backdrop-in 0.15s ease forwards; }
  .modal-panel { animation: modal-panel-in 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
`;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useFocusTrap(open);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', h, true);
    return () => document.removeEventListener('keydown', h, true);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <style>{CSS}</style>
      <div
        className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'modal-panel dark:bg-surface-2 flex max-h-[90vh] w-full flex-col rounded-xl border border-border bg-surface shadow-xl',
            SIZE[size],
            className
          )}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold leading-snug text-content">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-sm text-content-secondary">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-content-secondary transition-colors hover:bg-surface-secondary hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <FaTimes aria-hidden className="text-sm" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}

Modal.Footer = function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  );
};
