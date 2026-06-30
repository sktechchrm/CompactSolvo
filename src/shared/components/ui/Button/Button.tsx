import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-lg border border-transparent',
    'transition-all duration-150 cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'min-h-11', // WCAG 2.5.5 — 44px touch target
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:   'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow',
        secondary: 'bg-surface text-content border-border hover:bg-surface-secondary dark:bg-surface-2 dark:border-border',
        danger:    'bg-status-error text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
        ghost:     'bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content',
        success:   'bg-status-success text-white hover:bg-green-700 shadow-sm',
        excel:     'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
        pdf:       'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        print:     'bg-green-600 text-white hover:bg-green-700 shadow-sm',
        icon:      'bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content',
        link:      'bg-transparent text-brand-500 hover:text-brand-600 hover:underline p-0 min-h-0',
        reset:     'bg-amber-600 text-white hover:bg-amber-700 shadow-sm',
      },
      size: {
        xs: 'text-xs px-2.5 py-1.5 min-h-8 gap-1.5',
        sm: 'text-sm px-3 py-2 min-h-9 gap-1.5',
        md: 'text-sm px-4 py-2.5 min-h-11 gap-2',
        lg: 'text-base px-5 py-3 min-h-12 gap-2',
        icon: 'w-10 h-10 p-0 min-h-0 rounded-lg',
        'icon-sm': 'w-8 h-8 p-0 min-h-0 rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          VariantProps<typeof buttonVariants> {
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 animate-spin shrink-0" strokeWidth={2.5} stroke="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
      <path d="M22 12a10 10 0 0 0-10-10" strokeLinecap="round" />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, iconLeft, iconRight, children, className, disabled, type = 'button', ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button ref={ref} type={type} disabled={isDisabled}
        aria-disabled={isDisabled || undefined} aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {loading ? <Spinner /> : iconLeft && <span aria-hidden className="shrink-0">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span aria-hidden className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { buttonVariants };
