import { useCaptain } from '../../contexts/CaptainContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptainProfile = () => {
  const { captain, loading, logout } = useCaptain();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !captain) {
      navigate('/captain/login');
    }
  }, [captain, loading, navigate]);

  if (loading || !captain) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const {
    email,
    status,
    vehicle,
    fullname
  } = captain;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🚗 Captain Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-4 mb-6">
        <h2 className="text-xl font-semibold">👤 Personal Info</h2>
        <p><strong>Full Name:</strong> {fullname?.firstname} {fullname?.lastname || ''}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Status:</strong> <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>{status}</span></p>
      </div>

      {vehicle && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">🚙 Vehicle Info</h2>
          <p><strong>Type:</strong> {vehicle.vehicleType}</p>
          <p><strong>Color:</strong> {vehicle.color}</p>
          <p><strong>Plate Number:</strong> {vehicle.plate}</p>
          <p><strong>Capacity:</strong> {vehicle.capacity} passengers</p>
          {vehicle.location?.lat && vehicle.location?.lng && (
            <p><strong>Current Location:</strong> ({vehicle.location.lat}, {vehicle.location.lng})</p>
          )}
        </div>
      )}

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};
export default CaptainProfile;
