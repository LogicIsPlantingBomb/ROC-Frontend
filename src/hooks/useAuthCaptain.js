import { useCaptain } from '../contexts/CaptainContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuthCaptain = () => {
  const { captain, loading } = useCaptain();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !captain) {
      navigate('/captain/login', { state: { from: location }, replace: true });
    }
  }, [captain, loading, navigate, location]);

  return { captain, loading };
};
