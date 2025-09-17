import { useUser } from '../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuthUser = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/user/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location]);

  return { user, loading };
};
