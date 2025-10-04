import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Car, Mail, Lock, User, ArrowLeft, Crown, Navigation, Shield, BadgeCheck, Phone, Palette, Hash } from 'lucide-react';

const CaptainSignup = () => {
  const [formData, setFormData] = useState({
    fullname: { firstname: '', lastname: '' },
    email: '',
    password: '',
    phone: '',
    vehicle: {
      make: '',
      model: '',
      color: '',
      plate: '',
      capacity: '',
      vehicleType: 'car',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData((prev) => ({
          ...prev,
          [parts[0]]: { ...prev[parts[0]], [parts[1]]: value },
        }));
      } else if (parts.length === 3) {
        setFormData((prev) => ({
          ...prev,
          [parts[0]]: {
            ...prev[parts[0]],
            [parts[1]]: { ...prev[parts[0]][parts[1]], [parts[2]]: value },
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/captains/register', formData);
      localStorage.setItem('captainToken', res.data.token);
      navigate('/captain/captain-home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
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
        <div className="group relative w-full max-w-2xl">
          {/* Gradient Border */}
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
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-yellow-400">Captain Registration</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Join Our Captain Team</h2>
              <p className="text-gray-400">Start earning with RideOnCabio today</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <span>Personal Information</span>
                  </h3>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullname.firstname"
                      placeholder="First Name"
                      value={formData.fullname.firstname}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullname.lastname"
                      placeholder="Last Name"
                      value={formData.fullname.lastname}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
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
                </div>

                {/* Vehicle Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Car className="w-5 h-5 text-green-400" />
                    <span>Vehicle Information</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <input
                        type="text"
                        name="vehicle.make"
                        placeholder="Make (e.g., Toyota)"
                        value={formData.vehicle.make}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        name="vehicle.model"
                        placeholder="Model (e.g., Camry)"
                        value={formData.vehicle.model}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Palette className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="vehicle.color"
                      placeholder="Vehicle Color"
                      value={formData.vehicle.color}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="vehicle.plate"
                      placeholder="License Plate"
                      value={formData.vehicle.plate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <select
                        name="vehicle.vehicleType"
                        value={formData.vehicle.vehicleType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="car">Car</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="auto">Auto</option>
                        <option value="suv">SUV</option>
                      </select>
                    </div>
                    <div className="relative group">
                      <input
                        type="number"
                        name="vehicle.capacity"
                        placeholder="Capacity (seats)"
                        value={formData.vehicle.capacity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900 mt-1"
                    required
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Become a Captain</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have a captain account?{' '}
                <Link
                  to="/captain/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <BadgeCheck className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300 font-medium">Why become a Captain?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Flexible working hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Weekly payouts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
