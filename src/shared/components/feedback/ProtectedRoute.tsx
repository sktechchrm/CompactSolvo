import { Navigate, useLocation } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { SecurityGuard } from '../../../security/SecurityGuard';
import { Button } from '../ui/Button/Button';

const LABELS: Record<string, string> = {
  maternity:'Maternity Benefit', settlement:'Final Settlement', leftnotice:'Left Worker Notice',
  personalfile:'Personal File', requisition:'Requisition', increment:'Salary Increment',
  meeting:'Meeting Minutes', reports:'Reports', authority:'Authority Control',
  database:'Database Admin', grievance:'Grievance Management', workerguideline:'Worker Guideline', workerrights:'Worker Rights',
};

function AccessDenied({ moduleName, reason }: { moduleName: string; reason?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-secondary border border-border flex items-center justify-center">
        <FaLock className="text-3xl text-content-tertiary" aria-hidden />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-content mb-1">Access restricted</h1>
        <p className="text-content-secondary text-sm max-w-sm">You don't have permission to access <strong className="text-content">{moduleName}</strong>.</p>
      </div>
      {reason && <div className="text-xs text-content-secondary max-w-xs bg-surface-secondary border border-border rounded-lg px-4 py-2.5">{reason}</div>}
      <p className="text-xs text-content-tertiary">Contact your administrator if you need access.</p>
      <Button variant="secondary" size="sm" iconLeft={<FaArrowLeft />} onClick={() => window.history.back()}>Go back</Button>
    </div>
  );
}

export function ProtectedRoute({ module, children }: { module: string; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;
  const result = SecurityGuard.from(user).canAccessModule(module);
  if (!result.allowed) return <AccessDenied moduleName={LABELS[module] ?? module} reason={result.reason} />;
  return <>{children}</>;
}
