import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/user/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👤 User Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <p><strong>Full Name:</strong> {user.fullname.firstname} {user.fullname.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
      </div>
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
