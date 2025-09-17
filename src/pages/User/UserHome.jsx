import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/UserContext';
import { MapPin, Navigation, Car, Clock, Star, Phone } from 'lucide-react';
import socketService from '../../services/socket.service';
import api from '../../utils/api';

const UserHome = () => {
  const { user } = useUser();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [fare, setFare] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

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

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      socketService.connect();
      socketService.join(user._id, 'user');

      socketService.on('ride-confirmed', (ride) => {
        setCurrentRide(ride);
        alert(`Ride confirmed! Captain: ${ride.captain.fullname.firstname}`);
      });

      socketService.on('ride-started', (ride) => {
        setCurrentRide(ride);
        alert('Ride has started!');
      });

      socketService.on('ride-ended', (ride) => {
        setCurrentRide(ride);
        alert('Ride completed! Thank you for using our service.');
        setTimeout(() => setCurrentRide(null), 3000);
      });

      socketService.on('ride-cancelled', (ride) => {
        setCurrentRide(null);
        alert('Ride has been cancelled.');
      });
    }

    return () => {
      socketService.off('ride-confirmed');
      socketService.off('ride-started');
      socketService.off('ride-ended');
      socketService.off('ride-cancelled');
    };
  }, [user]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 15);
            
            // Clear existing markers
            markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
            markersRef.current = [];
            
            // Add user location marker
            const userMarker = window.L.marker([latitude, longitude])
              .addTo(mapInstance.current)
              .bindPopup('Your Location')
              .openPopup();
            
            markersRef.current.push(userMarker);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
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
      const token = localStorage.getItem('userToken');
      const response = await api.get(`/rides/get-fare?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFare(response.data);
    } catch (error) {
      console.error('Error getting fare:', error);
      alert('Error getting fare estimate');
    } finally {
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
      const token = localStorage.getItem('userToken');
      const response = await api.post('/rides/create', 
        { pickup, destination, vehicleType },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      setCurrentRide(response.data);
      alert('Ride created! Looking for captains nearby...');
    } catch (error) {
      console.error('Error creating ride:', error);
      alert('Error creating ride');
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!currentRide) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      await api.post('/rides/cancel-ride', 
        { rideId: currentRide._id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      setCurrentRide(null);
      alert('Ride cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling ride:', error);
      alert('Error cancelling ride');
    } finally {
      setLoading(false);
    }
  };

  const vehicleOptions = [
    { type: 'moto', name: 'Motorcycle', icon: '🏍️', capacity: '1-2' },
    { type: 'auto', name: 'Auto Rickshaw', icon: '🛺', capacity: '1-3' },
    { type: 'car', name: 'Car', icon: '🚗', capacity: '1-4' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Book Your Ride</h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.fullname?.firstname?.[0]}
              </span>
            </div>
            <span className="font-medium text-gray-700">
              {user?.fullname?.firstname}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <div className="space-y-6">
          {!currentRide ? (
            <>
              {/* Location Inputs */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Where to?</h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={getFareEstimate}
                  disabled={loading}
                  className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Getting Fare...' : 'Get Fare Estimate'}
                </button>
              </div>

              {/* Vehicle Selection */}
              {fare && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Choose Vehicle</h3>
                  <div className="space-y-3">
                    {vehicleOptions.map((vehicle) => (
                      <div
                        key={vehicle.type}
                        onClick={() => setVehicleType(vehicle.type)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          vehicleType === vehicle.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{vehicle.icon}</span>
                            <div>
                              <h4 className="font-medium">{vehicle.name}</h4>
                              <p className="text-sm text-gray-500">
                                {vehicle.capacity} passengers
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{fare[vehicle.type]}</p>
                            <p className="text-xs text-gray-500">Estimated fare</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={createRide}
                    disabled={loading}
                    className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Book Ride'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Current Ride Details */
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Current Ride</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentRide.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    currentRide.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    currentRide.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentRide.status.charAt(0).toUpperCase() + currentRide.status.slice(1)}
                  </span>
                </div>

                {currentRide.captain && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Captain Details</h4>
                    <p className="text-sm">
                      <strong>Name:</strong> {currentRide.captain.fullname?.firstname} {currentRide.captain.fullname?.lastname}
                    </p>
                    <p className="text-sm">
                      <strong>Vehicle:</strong> {currentRide.captain.vehicle?.color} {currentRide.captain.vehicle?.make} {currentRide.captain.vehicle?.model}
                    </p>
                    <p className="text-sm">
                      <strong>Plate:</strong> {currentRide.captain.vehicle?.plate}
                    </p>
                    {currentRide.status === 'accepted' && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <p className="text-sm font-medium text-yellow-800">
                          OTP: {currentRide.otp}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Share this OTP with your captain to start the ride
                        </p>
                      </div>
                    )}
                  </div>
                )}

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

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Fare</p>
                  <p className="font-bold text-xl">₹{currentRide.fare}</p>
                </div>

                {(currentRide.status === 'pending' || currentRide.status === 'accepted') && (
                  <button
                    onClick={cancelRide}
                    disabled={loading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    {loading ? 'Cancelling...' : 'Cancel Ride'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-96 lg:h-full" ref={mapRef}></div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
