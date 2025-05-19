
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user, profile, isLoading, isInitialized, refreshProfile, refreshSession } = useAuth();
  const location = useLocation();

  // Try to refresh session if needed
  useEffect(() => {
    if (isInitialized && !user && !isLoading) {
      refreshSession();
    }
  }, [isInitialized, user, isLoading, refreshSession]);

  // Refresh profile if needed
  useEffect(() => {
    if (user && !profile && !isLoading) {
      refreshProfile();
    }
  }, [user, profile, isLoading, refreshProfile]);

  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    // Store the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role-based access control (if roles are required)
  if (requiredRoles && requiredRoles.length > 0) {
    // This is a placeholder for role-based checks
    // You would need to implement this based on your user profile structure
    const userRoles = profile?.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
