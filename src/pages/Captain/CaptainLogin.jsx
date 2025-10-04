import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useCaptain } from '../../contexts/CaptainContext';
import { Car, Mail, Lock, ArrowLeft, Crown, Navigation } from 'lucide-react';

const CaptainLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useCaptain();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/captains/login', formData);
      login(res.data.token);
      navigate('/captain/captain-home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background with Captain-themed colors */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 pt-6 px-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="group relative w-full max-w-md">
          {/* Gradient Border - Captain theme */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Main Card */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Navigation className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent">
                  RideOnCabio
                </h1>
              </div>
              
              {/* Captain Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-yellow-400">Captain Portal</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Captain</h2>
              <p className="text-gray-400">Sign in to manage your rides</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Captain Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Car className="w-5 h-5" />
                    <span>Captain Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have a captain account?{' '}
                <Link
                  to="/captain/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Captain-specific Info */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-blue-300 font-medium">Captain Benefits</p>
              </div>
              <p className="text-xs text-gray-400">
                • Earn money on your schedule • Flexible working hours • Weekly payouts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
