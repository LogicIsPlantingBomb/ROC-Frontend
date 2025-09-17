import React, { useState, useEffect, useRef } from 'react';
import { useCaptain } from '../../contexts/CaptainContext';
import { MapPin, Navigation, Clock, Star, Phone, CheckCircle, XCircle, Play, Square } from 'lucide-react';
import socketService from '../../services/socket.service';
import api from '../../utils/api'; // Import the api instance

const CaptainHome = () => {
  const { captain } = useCaptain();
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [otp, setOtp] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const locationInterval = useRef(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      // Load Leaflet CSS and JS
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setupMap();
        document.head.appendChild(script);
      } else {
        setupMap();
      }
    };

    const setupMap = () => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([23.2599, 77.4126], 13);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        getCurrentLocation();
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
      socketService.connect();
      socketService.join(captain._id, 'captain');

      socketService.on('new-ride', (ride) => {
        setRideRequest(ride);
      });

      socketService.on('ride-cancelled', (ride) => {
        setRideRequest(null);
        setCurrentRide(null);
        alert('Ride has been cancelled by the user.');
      });

      if (isOnline) {
        startLocationTracking();
      } else {
        stopLocationTracking();
      }
    }

    return () => {
      socketService.off('new-ride');
      socketService.off('ride-cancelled');
      stopLocationTracking();
    };
  }, [captain, isOnline]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { ltd: latitude, lng: longitude };
          setCaptainLocation(location);
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 15);
            
            // Clear existing markers
            markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
            markersRef.current = [];
            
            // Add captain location marker
            const captainMarker = window.L.marker([latitude, longitude])
              .addTo(mapInstance.current)
              .bindPopup('Your Location')
              .openPopup();
            
            markersRef.current.push(captainMarker);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
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
            const location = { ltd: latitude, lng: longitude };
            setCaptainLocation(location);
            
            // Update location on server via socket
            socketService.updateCaptainLocation(captain._id, location);
            
            // Update map position
            if (mapInstance.current) {
              mapInstance.current.setView([latitude, longitude], 15);
              
              // Update marker position
              markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
              markersRef.current = [];
              
              const captainMarker = window.L.marker([latitude, longitude])
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
    }, 5000); // Update every 5 seconds
  };

  const stopLocationTracking = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const acceptRide = async () => {
    if (!rideRequest) return;
    
    setLoading(true);
    try {
      const response = await api.post('/rides/confirm', { rideId: rideRequest._id });
      
      setCurrentRide(response.data);
      setRideRequest(null);
      alert('Ride accepted successfully!');
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Error accepting ride');
    } finally {
      setLoading(false);
    }
  };

  const rejectRide = () => {
    setRideRequest(null);
  };

  const startRide = async () => {
    if (!currentRide || !otp) {
      alert('Please enter the OTP provided by the user');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/rides/start-ride', { rideId: currentRide._id, otp });
      
      setCurrentRide(response.data);
      setOtp('');
      alert('Ride started successfully!');
    } catch (error) {
      console.error('Error starting ride:', error);
      alert('Invalid OTP or error starting ride');
    } finally {
      setLoading(false);
    }
  };

  const endRide = async () => {
    if (!currentRide) return;
    
    setLoading(true);
    try {
      const response = await api.post('/rides/end-ride', { rideId: currentRide._id });
      
      alert(`Ride completed! You earned ₹${response.data.fare}`);
      setCurrentRide(null);
    } catch (error) {
      console.error('Error ending ride:', error);
      alert('Error ending ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-800">Captain Dashboard</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleOnlineStatus}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isOnline 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {captain?.fullname?.firstname?.[0]}
                </span>
              </div>
              <span className="font-medium text-gray-700">
                {captain?.fullname?.firstname}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-2">
              <p><strong>Vehicle:</strong> {captain?.vehicle?.color} {captain?.vehicle?.make} {captain?.vehicle?.model}</p>
              <p><strong>Plate:</strong> {captain?.vehicle?.plate}</p>
              <p><strong>Type:</strong> {captain?.vehicle?.vehicleType}</p>
              <p><strong>Capacity:</strong> {captain?.vehicle?.capacity} passengers</p>
            </div>
          </div>

          {/* Ride Request */}
          {rideRequest && (
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-400">
              <h3 className="text-lg font-semibold mb-4 text-yellow-800">New Ride Request</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Pickup</p>
                    <p className="font-medium text-sm">{rideRequest.pickup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium text-sm">{rideRequest.destination}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-medium text-sm">
                      {rideRequest.user?.fullname?.firstname} {rideRequest.user?.fullname?.lastname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fare</p>
                    <p className="font-bold text-lg">₹{rideRequest.fare}</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={acceptRide}
                    disabled={loading}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{loading ? 'Accepting...' : 'Accept'}</span>
                  </button>
                  <button
                    onClick={rejectRide}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 flex items-center justify-center space-x-2"
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Current Ride</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentRide.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    currentRide.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentRide.status.charAt(0).toUpperCase() + currentRide.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-medium text-sm">
                      {currentRide.user?.fullname?.firstname} {currentRide.user?.fullname?.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{currentRide.user?.email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Fare</p>
                    <p className="font-bold text-lg">₹{currentRide.fare}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pickup</p>
                    <p className="font-medium text-sm">{currentRide.pickup}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium text-sm">{currentRide.destination}</p>
                  </div>
                </div>

                {currentRide.status === 'accepted' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-700 mb-2">
                        Ask the user for their OTP to start the ride
                      </p>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={6}
                        />
                        <button
                          onClick={startRide}
                          disabled={loading || otp.length !== 6}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
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
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>{loading ? 'Ending...' : 'End Ride'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Card */}
          {!rideRequest && !currentRide && isOnline && (
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready for Rides</h3>
              <p className="text-gray-600">You're online and ready to accept ride requests!</p>
            </div>
          )}

          {!isOnline && (
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">You're Offline</h3>
              <p className="text-gray-600">Go online to start receiving ride requests</p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Your Location</h3>
          </div>
          <div className="h-96 lg:h-full" ref={mapRef}></div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
