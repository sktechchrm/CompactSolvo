import React from 'react';
import { FaExclamationTriangle, FaRedo, FaCopy } from 'react-icons/fa';
import { cn } from '../../utils/cn';

interface Props { children: React.ReactNode; moduleName?: string; fallback?: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; errorId: string | null; copied: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false, error: null, errorId: null, copied: false };

static getDerivedStateFromError(error: Error): Partial<State> {
  return { hasError: true, error, errorId: `ERR-${Date.now().toString(36).toUpperCase()}` };
}

componentDidCatch(error: Error, info: React.ErrorInfo) {
  console.error(`[ErrorBoundary:${this.props.moduleName ?? 'App'}]`, error, info.componentStack);
}

  handleRetry = () => this.setState({ hasError: false, error: null, errorId: null, copied: false });

  handleCopy = async () => {
    const { error, errorId } = this.state;
    const text = [`Error ID: ${errorId}`, `Module: ${this.props.moduleName ?? 'Unknown'}`, `Message: ${error?.message}`, `Time: ${new Date().toISOString()}`].join('\n');
    try { await navigator.clipboard.writeText(text); this.setState({ copied: true }); setTimeout(() => this.setState({ copied: false }), 2000); } catch { /* noop */ }
  };

  override render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    const { error, errorId, copied } = this.state;
    return (
      <div role="alert" aria-live="assertive" className="flex flex-col items-center justify-center min-h-[50vh] gap-5 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-status-warning-bg border border-status-warning-border flex items-center justify-center">
          <FaExclamationTriangle className="text-2xl text-status-warning" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-content mb-1">
            {this.props.moduleName ? `${this.props.moduleName} encountered an error` : 'Something went wrong'}
          </h2>
          <p className="text-sm text-content-secondary max-w-sm mx-auto">{error?.message ?? 'An unexpected error occurred.'}</p>
        </div>
        {errorId && (
          <div className="flex items-center gap-2">
            <code className="text-xs bg-surface-secondary border border-border rounded px-2 py-1 text-content-tertiary font-mono">{errorId}</code>
            <button onClick={this.handleCopy} aria-label="Copy error details"
              className="text-xs text-content-secondary hover:text-content flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-secondary">
              <FaCopy className="text-xs" aria-hidden /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={this.handleRetry}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2')}>
            <FaRedo className="text-xs" aria-hidden /> Try again
          </button>
          <button onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-surface border border-border text-content hover:bg-surface-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
            Refresh page
          </button>
        </div>
      </div>
    );
  }
}
