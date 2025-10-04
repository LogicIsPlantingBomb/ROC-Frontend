import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCaptain } from '../contexts/CaptainContext';

const Navbar = () => {
  const { user, logout: userLogout, loading: userLoading } = useUser();
  const { captain, logout: captainLogout, loading: captainLoading } = useCaptain();

  const loading = userLoading || captainLoading;

  const activeLinkStyle = {
    color: '#FFFFFF',
    backgroundColor: 'rgba(75, 85, 99, 0.5)',
  };

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-black to-gray-900 text-gray-200 p-4 shadow-lg border-b border-gray-700 relative z-50">
        <div className="container mx-auto text-center">Loading your session...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black text-gray-200 p-4 shadow-xl border-b border-gray-700 relative z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <NavLink 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent hover:from-gray-200 hover:to-slate-300 transition-all duration-300"
        >
          RideOnCabio
        </NavLink>
        <div className="flex flex-wrap justify-center items-center gap-4">
          {!user && !captain ? (
            <>
              <NavLink 
                to="/user/login" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-gray-800 to-slate-800 hover:from-gray-700 hover:to-slate-700 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                👤 User Login
              </NavLink>
              <NavLink 
                to="/user/signup" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-gray-800 to-slate-800 hover:from-gray-700 hover:to-slate-700 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                👤 User Signup
              </NavLink>
            </>
          ) : user ? (
            <>
              <span className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 px-4 py-2 rounded-lg border border-gray-600 font-medium text-gray-300">
                Welcome, <span className="text-gray-200">{user.firstname}</span>
              </span>
              <NavLink 
                to="/user/user-home" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                Home
              </NavLink>
              <NavLink 
                to="/user/profile" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                Profile
              </NavLink>
              <button 
                onClick={userLogout} 
                className="bg-gradient-to-r from-red-900/50 to-red-800/50 hover:from-red-800 hover:to-red-700 px-4 py-2 rounded-lg border border-red-700/50 hover:border-red-600 transition-all duration-300 font-medium text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : captain ? (
            <>
              <span className="bg-gradient-to-r from-slate-800/50 to-zinc-800/50 px-4 py-2 rounded-lg border border-gray-600 font-medium text-gray-300">
                Captain <span className="text-gray-200">{captain.firstname}</span>
              </span>
              <NavLink 
                to="/captain/captain-home" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-slate-700 to-zinc-700 hover:from-slate-600 hover:to-zinc-600 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                Home
              </NavLink>
              <NavLink 
                to="/captain/profile" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="bg-gradient-to-r from-slate-700 to-zinc-700 hover:from-slate-600 hover:to-zinc-600 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 font-medium text-gray-300 hover:text-gray-200"
              >
                Profile
              </NavLink>
              <button 
                onClick={captainLogout} 
                className="bg-gradient-to-r from-red-900/50 to-red-800/50 hover:from-red-800 hover:to-red-700 px-4 py-2 rounded-lg border border-red-700/50 hover:border-red-600 transition-all duration-300 font-medium text-red-400 hover:text-red-300"
              >
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
