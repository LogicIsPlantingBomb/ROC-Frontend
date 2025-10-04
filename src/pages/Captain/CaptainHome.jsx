import React, { useState, useEffect, useRef } from 'react';
import { useCaptain } from '../../contexts/CaptainContext';
import { MapPin, Navigation, Clock, Star, Phone, CheckCircle, XCircle, Play, Square, Crown, Car, User, Wallet, Target, LogOut } from 'lucide-react';
import socket from '../../services/socket';
import api from '../../utils/api';

const CaptainHome = () => {
  const { captain, setCaptain, logout } = useCaptain();
  const [isOnline, setIsOnline] = useState(captain?.isAvailable || false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [otp, setOtp] = useState('');
  const [route, setRoute] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routePolyline = useRef(null);
  const locationInterval = useRef(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => getCurrentLocation(setupMap);
        document.head.appendChild(script);
      } else {
        getCurrentLocation(setupMap);
      }
    };

    const setupMap = (latitude, longitude) => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([latitude, longitude], 13);
        
        // Dark theme map tiles
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(mapInstance.current);
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Initialize socket connection and location tracking
  useEffect(() => {
    if (captain) {
      socket.on('newRideRequest', (ride) => {
        setRideRequest(ride);
      });

      if (isOnline) {
        startLocationTracking();
      } else {
        stopLocationTracking();
      }
    }

    return () => {
      socket.off('newRideRequest');
      stopLocationTracking();
    };
  }, [captain, isOnline]);

  useEffect(() => {
    if (mapInstance.current) {
      if (routePolyline.current) {
        mapInstance.current.removeLayer(routePolyline.current);
      }

      if (route) {
        routePolyline.current = window.L.polyline(route, { color: '#3b82f6', weight: 4 }).addTo(mapInstance.current);
        mapInstance.current.fitBounds(routePolyline.current.getBounds());
      }
    }
  }, [route]);

  const getCurrentLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { latitude, longitude };
          setCaptainLocation(location);
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 15);
            
            markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
            markersRef.current = [];
            
            // Custom blue marker for captain
            const blueIcon = window.L.divIcon({
              html: `<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
              iconSize: [24, 24],
              className: 'captain-marker'
            });
            
            const captainMarker = window.L.marker([latitude, longitude], { icon: blueIcon })
              .addTo(mapInstance.current)
              .bindPopup('Your Location')
              .openPopup();
            
            markersRef.current.push(captainMarker);
          }
          if (callback) {
            callback(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          if (callback) {
            callback(23.2599, 77.4126);
          }
        }
      );
    }
  };

  const startLocationTracking = () => {
    if (locationInterval.current) return;
    
    locationInterval.current = setInterval(() => {
      if (navigator.geolocation && captain) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = { latitude, longitude };
            setCaptainLocation(location);
            
            socket.emit('updateCaptainLocation', { captainId: captain._id, location });
            
            if (mapInstance.current) {
              mapInstance.current.setView([latitude, longitude], 15);
              
              markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
              markersRef.current = [];
              
              const blueIcon = window.L.divIcon({
                html: `<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
                iconSize: [24, 24],
                className: 'captain-marker'
              });
              
              const captainMarker = window.L.marker([latitude, longitude], { icon: blueIcon })
                .addTo(mapInstance.current)
                .bindPopup('Your Location');
              
              markersRef.current.push(captainMarker);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }, 5000);
  };

  const stopLocationTracking = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  const toggleOnlineStatus = async () => {
    setLoading(true);
    try {
      const newAvailability = !isOnline;
      const token = localStorage.getItem('captainToken');
      const response = await api.post('/captains/update-availability', 
        { isAvailable: newAvailability },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      setIsOnline(newAvailability);
      setCaptain(prevCaptain => ({ ...prevCaptain, isAvailable: newAvailability }));
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async () => {
    if (!rideRequest) return;
    
    setLoading(true);
    try {
      socket.emit('acceptRideRequest', { rideRequestId: rideRequest._id, captainId: captain._id }, (ride) => {
        setCurrentRide(ride);
        setRideRequest(null);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
      setLoading(false);
    }
  };

  const rejectRide = () => {
    if (!rideRequest) return;
    socket.emit('cancelRideRequest', { rideRequestId: rideRequest._id });
    setRideRequest(null);
  };

  const startRide = async () => {
    if (!currentRide || !otp) return;
    
    setLoading(true);
    try {
      const response = await api.post('/rides/start-ride', { rideId: currentRide._id, otp });
      setCurrentRide(response.data);
      setOtp('');
    } catch (error) {
      console.error('Error starting ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const endRide = async () => {
    if (!currentRide) return;
    
    setLoading(true);
    try {
      const response = await api.post('/rides/end-ride', { rideId: currentRide._id });
      setCurrentRide(null);
    } catch (error) {
      console.error('Error ending ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!currentRide) return;

    setLoading(true);
    try {
      await api.post('/rides/cancel-ride-by-captain', { rideId: currentRide._id });
      setCurrentRide(null);
    } catch (error) {
      console.error('Error cancelling ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    stopLocationTracking();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent">
                RideOnCabio
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Captain</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-medium">{captain?.fullname?.firstname} {captain?.fullname?.lastname}</p>
                <p className="text-gray-400 text-sm">{captain?.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Status</h2>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                  <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              <button
                onClick={toggleOnlineStatus}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] ${
                  isOnline 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                } disabled:opacity-50`}
              >
                {loading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Car className="w-6 h-6 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Vehicle</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Model</span>
                  <span className="text-white font-medium">{captain?.vehicle?.make} {captain?.vehicle?.model}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Plate</span>
                  <span className="text-white font-medium">{captain?.vehicle?.plate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{captain?.vehicle?.vehicleType}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">{captain?.vehicle?.capacity} seats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="w-6 h-6 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Today's Earnings</h2>
              </div>
              
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-green-400">₹0</p>
                <p className="text-gray-400 text-sm">0 rides completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ride Request */}
          {rideRequest && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-lg font-semibold text-yellow-400">New Ride Request</h2>
                  </div>
                  <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
                    <span className="text-yellow-400 text-sm font-medium">₹{rideRequest.fare}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Pickup</p>
                    <p className="text-white font-medium">{rideRequest.pickup}</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Destination</p>
                    <p className="text-white font-medium">{rideRequest.destination}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={acceptRide}
                    disabled={loading}
                    className="flex-1 bg-green-500/20 text-green-400 py-3 rounded-lg font-medium hover:bg-green-500/30 border border-green-500/30 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{loading ? 'Accepting...' : 'Accept Ride'}</span>
                  </button>
                  <button
                    onClick={rejectRide}
                    className="flex-1 bg-red-500/20 text-red-400 py-3 rounded-lg font-medium hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Current Ride */}
          {currentRide && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Car className="w-6 h-6 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">Current Ride</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentRide.status === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                    currentRide.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {currentRide.status.charAt(0).toUpperCase() + currentRide.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">User</p>
                    <p className="text-white font-medium">
                      {currentRide.user?.fullname?.firstname} {currentRide.user?.fullname?.lastname}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Fare</p>
                    <p className="text-green-400 font-bold text-lg">₹{currentRide.fare}</p>
                  </div>
                </div>

                {currentRide.status === 'accepted' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-blue-300 text-sm mb-3">Ask the user for their OTP to start the ride</p>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={6}
                        />
                        <button
                          onClick={startRide}
                          disabled={loading || otp.length !== 6}
                          className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-50 flex items-center space-x-2 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          <span>{loading ? 'Starting...' : 'Start'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentRide.status === 'ongoing' && (
                  <button
                    onClick={endRide}
                    disabled={loading}
                    className="w-full bg-red-500/20 text-red-400 py-3 rounded-lg font-medium hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Square className="w-4 h-4" />
                    <span>{loading ? 'Ending...' : 'End Ride'}</span>
                  </button>
                )}

                {(currentRide.status === 'accepted' || currentRide.status === 'ongoing') && (
                  <button
                    onClick={cancelRide}
                    disabled={loading}
                    className="w-full bg-gray-500/20 text-gray-400 py-3 rounded-lg font-medium hover:bg-gray-500/30 border border-gray-500/30 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all mt-3"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{loading ? 'Cancelling...' : 'Cancel Ride'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Live Location</span>
                </h3>
              </div>
              <div className="h-96" ref={mapRef}></div>
            </div>
          </div>

          {/* Status Message */}
          {!rideRequest && !currentRide && isOnline && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Ready for Rides</h3>
                <p className="text-gray-400">You're online and ready to accept ride requests!</p>
              </div>
            </div>
          )}

          {!isOnline && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">You're Offline</h3>
                <p className="text-gray-400">Go online to start receiving ride requests</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
