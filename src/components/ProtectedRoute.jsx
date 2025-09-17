import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCaptain } from '../contexts/CaptainContext';

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  if (role === 'user') {
    const { user, loading } = useUser();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }
  }

  if (role === 'captain') {
    const { captain, loading } = useCaptain();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (!captain) {
      return <Navigate to="/captain/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
