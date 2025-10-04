import React, { useState, useEffect, useRef, useContext } from 'react';
import { MapPin, Navigation, Car, Clock, Star, Phone, Bell, CreditCard, Zap, Shield, X, Users, Bike, Heart, Globe } from 'lucide-react';
import socket from '../../services/socket';
import { useUser } from '../../contexts/UserContext';

const UserHome = () => {
  const { user } = useUser();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [fare, setFare] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [nearbyCaptains, setNearbyCaptains] = useState([]);
  const [route, setRoute] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const captainMarkerRef = useRef(null);
  const routePolyline = useRef(null);

  const [rideRequest, setRideRequest] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "denied") {
          alert("Please enable location services to use the map.");
          return;
        }
      }

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

  useEffect(() => {
    if (mapInstance.current) {
      if (routePolyline.current) {
        mapInstance.current.removeLayer(routePolyline.current);
      }

      if (route) {
        routePolyline.current = window.L.polyline(route, { 
          color: '#60a5fa',
          weight: 4,
          opacity: 0.8
        }).addTo(mapInstance.current);
        mapInstance.current.fitBounds(routePolyline.current.getBounds());
      }
    }
  }, [route]);

  useEffect(() => {
    socket.on(`rideRequestAccepted_${user?._id}`, (ride) => {
      setCurrentRide(ride);
      setLoading(false);
      setCaptainLocation({ latitude: 23.2599, longitude: 77.4126 });
    });

    socket.on('rideRequestCancelled', () => {
      setCurrentRide(null);
      setRoute(null);
      setCaptainLocation(null);
      setLoading(false);
    });

    socket.on('rideCancellationFailed', ({ message }) => {
      alert(message);
      setLoading(false);
    });

    return () => {
      socket.off(`rideRequestAccepted_${user?._id}`);
      socket.off('rideRequestCancelled');
      socket.off('rideCancellationFailed');
    };
  }, [user]);

  const getCurrentLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 15);
            
            markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
            markersRef.current = [];
            
            const userMarker = window.L.marker([latitude, longitude])
              .addTo(mapInstance.current)
              .bindPopup('Your Location')
              .openPopup();
            
            markersRef.current.push(userMarker);
          }
          if (callback) {
            callback(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Error getting location. Please enable location services in your browser settings.');
        }
      );
    }
  };

  const getFareEstimate = async () => {
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination');
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        setFare({
          moto: 45,
          auto: 65,
          car: 120
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting fare:', error);
      alert('Error getting fare estimate');
      setLoading(false);
    }
  };

  const createRide = async () => {
    if (!pickup || !destination || !vehicleType) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const rideRequestData = {
        userId: user._id,
        source: pickup,
        destination,
        vehicleType,
        fare: fare[vehicleType],
      };
      setRideRequest(rideRequestData);
      socket.emit('newRideRequest', rideRequestData, (ride) => {
        setCurrentRide(ride);
      });
    } catch (error) {
      console.error('Error creating ride:', error);
      alert('Error creating ride');
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!currentRide && !rideRequest) return;

    setLoading(true);
    try {
      const rideRequestId = currentRide ? currentRide._id : rideRequest._id;
      socket.emit('cancelRideRequest', { rideRequestId });
    } catch (error) {
      console.error('Error cancelling ride:', error);
      alert('Error cancelling ride');
      setLoading(false);
    }
  };


  const vehicleOptions = [
    { 
      type: 'moto', 
      name: 'Motorcycle', 
      icon: '🏍️', 
      capacity: '1-2',
      time: '2-5 min',
      description: 'Quick and affordable'
    },
    { 
      type: 'auto', 
      name: 'Auto Rickshaw', 
      icon: '🛺', 
      capacity: '1-3',
      time: '3-7 min',
      description: 'Perfect for city rides'
    },
    { 
      type: 'car', 
      name: 'Car', 
      icon: '🚗', 
      capacity: '1-4',
      time: '5-10 min',
      description: 'Comfortable and safe'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-zinc-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-gray-700/50 sticky top-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-slate-500 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">
              RideOnCabio
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors group relative">
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-white" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/30">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.fullname?.firstname?.[0]}
                </span>
              </div>
              <span className="font-medium text-gray-200">
                {user?.fullname?.firstname}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="space-y-6">
          {!currentRide ? (
            <>
              {/* Location Inputs */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-gray-400" />
                    Where to?
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={getFareEstimate}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-gray-600 to-slate-700 text-gray-200 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-slate-600 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                        <span>Getting Fare...</span>
                      </div>
                    ) : (
                      'Get Fare Estimate'
                    )}
                  </button>
                </div>
              </div>

              {/* Vehicle Selection */}
              {fare && (
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500 to-zinc-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-6 text-white">Choose Vehicle</h3>
                    <div className="space-y-4">
                      {vehicleOptions.map((vehicle) => (
                        <div
                          key={vehicle.type}
                          onClick={() => setVehicleType(vehicle.type)}
                          className={`group p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                            vehicleType === vehicle.type
                              ? 'border-gray-500 bg-gray-500/20 shadow-lg'
                              : 'border-gray-600/30 hover:border-gray-500 bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{vehicle.icon}</div>
                              <div>
                                <h4 className="font-semibold text-white">{vehicle.name}</h4>
                                <p className="text-sm text-gray-400">{vehicle.description}</p>
                                <div className="flex items-center space-x-3 mt-1">
                                  <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                                    👥 {vehicle.capacity}
                                  </span>
                                  <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                                    ⏱️ {vehicle.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">₹{fare[vehicle.type]}</p>
                              <p className="text-xs text-gray-400">Estimated fare</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={createRide}
                      disabled={loading}
                      className="w-full mt-6 bg-gradient-to-r from-gray-600 to-slate-700 text-gray-200 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-slate-600 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                          <span>Booking...</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 inline mr-2" />
                          Book Ride
                        </>
                      )}
                    </button>
                    {loading && (
                      <button
                        onClick={cancelRide}
                        className="w-full mt-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 py-4 rounded-xl font-semibold hover:from-red-600/20 hover:to-pink-600/20 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-red-500/30"
                      >
                        <X className="w-5 h-5 inline mr-2" />
                        Cancel Ride
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Current Ride Details */
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Current Ride</h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    currentRide.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    currentRide.status === 'accepted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    currentRide.status === 'ongoing' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {currentRide.status.charAt(0).toUpperCase() + currentRide.status.slice(1)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {currentRide.captain && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {currentRide.captain.fullname?.firstname?.[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {currentRide.captain.fullname?.firstname} {currentRide.captain.fullname?.lastname}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-300">4.8</span>
                            </div>
                          </div>
                        </div>
                        <a 
                          href={`tel:${currentRide.captain.phone}`}
                          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                      </div>
                      
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">Vehicle:</strong> {currentRide.captain.vehicle?.color} {currentRide.captain.vehicle?.make} {currentRide.captain.vehicle?.model}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">Plate:</strong> {currentRide.captain.vehicle?.plate}
                        </p>
                      </div>

                      {currentRide.status === 'accepted' && currentRide.otp && (
                        <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-yellow-300 text-lg">OTP: {currentRide.otp}</p>
                              <p className="text-xs text-yellow-400">Share this OTP with your captain to start the ride</p>
                            </div>
                            <Shield className="w-8 h-8 text-yellow-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-400">Pickup</p>
                          <p className="font-semibold text-white">{currentRide.pickup}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-400">Destination</p>
                          <p className="font-semibold text-white">{currentRide.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-lg p-4 border border-gray-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Fare</p>
                        <p className="text-3xl font-bold text-white">₹{currentRide.fare}</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  {(currentRide.status === 'pending' || currentRide.status === 'accepted') && (
                    <button
                      onClick={cancelRide}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 py-4 rounded-xl font-semibold hover:from-red-600/20 hover:to-pink-600/20 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-red-500/30"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                          <span>Cancelling...</span>
                        </div>
                      ) : (
                        <>
                          <X className="w-5 h-5 inline mr-2" />
                          Cancel Ride
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden h-full min-h-[500px]">
            <div className="bg-gradient-to-r from-gray-600 to-slate-700 p-4">
              <h3 className="text-white font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Live Map
              </h3>
            </div>
            <div className="h-full" ref={mapRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
