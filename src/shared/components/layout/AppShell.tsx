import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from '../../../components/common/Navigation';
import Footer from '../../../components/common/footer';
import { ErrorBoundary } from '../feedback/ErrorBoundary';
import SessionWarningBanner from '../../../components/common/SessionWarningBanner';
import SkipNav from '../../../components/common/SkipNav';

export function AppShell() {
  return (
    <>
      <SkipNav />
      <SessionWarningBanner />
      <Navigation />
      <div className="min-h-screen bg-surface-secondary flex flex-col">
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none pt-[var(--nav-height,60px)] pb-[var(--footer-height,40px)]" style={{ scrollPaddingTop: 'var(--nav-height,60px)' }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors closeButton duration={4000}
        toastOptions={{ classNames: { toast:'font-sans text-sm', title:'font-semibold' } }} />
    </>
  );
}
