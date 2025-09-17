import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCaptain } from '../contexts/CaptainContext';

const Navbar = () => {
  const { user, logout: userLogout, loading: userLoading } = useUser();
  const { captain, logout: captainLogout, loading: captainLoading } = useCaptain();

  const loading = userLoading || captainLoading;

  if (loading) {
    return (
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="container mx-auto text-center">Loading your session...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-xl font-bold">RideOnCabio</Link>
        <div className="flex flex-wrap justify-center gap-4">
          {!user && !captain ? (
            <>
              <Link to="/user/login" className="hover:underline font-medium">👤 User Login</Link>
              <Link to="/captain/login" className="hover:underline font-medium">🚛 Captain Login</Link>
            </>
          ) : user ? (
            <>
              <span className="font-medium">Welcome, {user.firstname}</span>
              <Link to="/user/profile" className="hover:underline">Profile</Link>
              <button onClick={userLogout} className="hover:underline font-medium text-red-200">
                Logout
              </button>
            </>
          ) : captain ? (
            <>
              <span className="font-medium">Captain {captain.firstname}</span>
              <Link to="/captain/profile" className="hover:underline">Profile</Link>
              <button onClick={captainLogout} className="hover:underline font-medium text-red-200">
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
