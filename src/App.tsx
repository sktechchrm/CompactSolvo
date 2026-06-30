/**
 * App.tsx — Root application setup.
 * 
 * Provider order (outermost → innermost):
 *   AuthProvider → QueryProvider → ThemeProvider → BrowserRouter → Routes
 *
 * All lazy-loaded modules are wrapped in ProtectedRoute + Suspense.
 * The AppShell provides Navigation, Footer, Toaster, ErrorBoundary for all auth'd routes.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryProvider } from './app/providers/QueryProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppShell } from './shared/components/layout/AppShell';
import { ProtectedRoute } from './shared/components/feedback/ProtectedRoute';
import { ModuleLoader } from './shared/components/ui/Skeleton/Skeleton';
import LoginPage from './auth/login';
import NotFound from './pages/notFound';
// Dashboard is eager — first screen after login
import Dashboard from './components/Dashboard';

// ── Lazy HR modules ────────────────────────────────────────────────────────────
const MaternityBenefit   = lazy(() => import('./components/maternityBenefit/maternityBenefit'));
const FinalSettlement    = lazy(() => import('./components/finalSettlement/FinalSettlement'));
const LeftNotice         = lazy(() => import('./components/LeftEmployeeNotice/EmployeeNoticeView'));
const RequisitionManager = lazy(() => import('./components/requisition/RequisitionManager'));
const IncrementManager   = lazy(() => import('./components/incrementBill/IncrementManager'));
const PersonalFile       = lazy(() => import('./components/employeePersonalFile/EmployeeFileSystem'));
const Meeting            = lazy(() => import('./components/meeting/MeetingManager'));
const WorkerRights       = lazy(() => import('./components/mapp/WorkerRights'));
const WorkerGuidelineViewer = lazy(() => import('./components/workerGuideline/WorkerGuidelineViewer'));
const WorkerGuidelinePage   = lazy(() => import('./components/workerGuideline/WorkerGuidelinePage'));
const ReportModule          = lazy(() => import('./components/reports/ReportModule'));
const AuthorityControl      = lazy(() => import('./components/authorityControl/AuthorityControl'));
const DatabaseAdmin         = lazy(() => import('./components/admin/DatabaseAdmin'));
const GrievanceModule       = lazy(() => import('./components/grievance/GrievanceModule'));

// ── Suspense wrapper ───────────────────────────────────────────────────────────
function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ModuleLoader />}>{children}</Suspense>;
}

// ── Module wrapper: ProtectedRoute + Suspense ──────────────────────────────────
function M({ module, children }: { module: string; children: React.ReactNode }) {
  return <ProtectedRoute module={module}><S>{children}</S></ProtectedRoute>;
}

// ── Public route — redirect authenticated users to dashboard ───────────────────
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ── Authenticated guard ────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ── Dashboard wrapper: needs setCurrentPage removed — now uses navigate ────────
// Dashboard previously used setCurrentPage; now uses React Router useNavigate()
function DashboardPage() {
  return <Dashboard />;
}

// ── Reports adapter: ReportModule previously received onNavigateToModule prop ──
function ReportsPage() {
  // useNavigate is now used inside ReportModule
  return <ReportModule />;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <BrowserRouter basename="/rms">
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Public worker guideline (QR-scan, no auth required) */}
        <Route path="/worker-guide/:factoryId" element={<S><WorkerGuidelinePage /></S>} />
        <Route path="/worker-guide/:factoryId/view" element={<S><WorkerGuidelineViewer /></S>} />

        {/* Protected HR shell */}
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/dashboard"           element={<DashboardPage />} />
          <Route path="/maternity"           element={<M module="maternity"><MaternityBenefit /></M>} />
          <Route path="/settlement"          element={<M module="settlement"><FinalSettlement /></M>} />
          <Route path="/left-notice"         element={<M module="leftnotice"><LeftNotice /></M>} />
          <Route path="/employees"           element={<M module="personalfile"><PersonalFile /></M>} />
          <Route path="/employees/:id"       element={<M module="personalfile"><PersonalFile /></M>} />
          <Route path="/requisition"         element={<M module="requisition"><RequisitionManager /></M>} />
          <Route path="/increment"           element={<M module="increment"><IncrementManager /></M>} />
          <Route path="/meeting"             element={<M module="meeting"><Meeting /></M>} />
          <Route path="/worker-rights"       element={<M module="workerrights"><WorkerRights /></M>} />
          <Route path="/worker-guideline/:factoryId" element={<S><WorkerGuidelineViewer /></S>} />
          <Route path="/reports"             element={<M module="reports"><ReportsPage /></M>} />
          <Route path="/grievance"           element={<M module="grievance"><GrievanceModule /></M>} />
          <Route path="/authority"           element={<M module="authority"><AuthorityControl /></M>} />
          <Route path="/admin/database"      element={<M module="database"><DatabaseAdmin /></M>} />
        </Route>

        <Route path="*" element={<NotFound type="notFound" />} />
      </Routes>
    </BrowserRouter>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
