import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, IdCard, LogOut, ArrowLeft, Car, Edit3, Shield } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-zinc-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 pt-6 px-6">
        <Link
          to="/user/user-home"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="group relative w-full max-w-2xl">
          {/* Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500 to-zinc-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Main Card */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-500 rounded-xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-black" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">
                  RideOnCabio
                </h1>
              </div>
              
              {/* Profile Avatar */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-600 to-slate-700 rounded-full flex items-center justify-center border-4 border-gray-700">
                  <User className="w-12 h-12 text-gray-200" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
              <p className="text-gray-400">Manage your account information</p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6 mb-8">
              {/* Full Name */}
              <div className="group">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Full Name</p>
                      <p className="text-white font-medium">
                        {user.fullname.firstname} {user.fullname.lastname}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Email Address</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div className="group">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">User ID</p>
                      <p className="text-white font-medium font-mono text-sm">{user._id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Edit Profile Button */}
              <button className="w-full bg-gradient-to-r from-gray-600 to-slate-700 text-gray-200 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-slate-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group">
                <Edit3 className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>Edit Profile</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 text-red-100 py-4 rounded-xl font-semibold hover:from-red-500/80 hover:to-red-600/80 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group border border-red-500/30"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Account Status */}
            <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-300 text-sm font-medium">Account Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
