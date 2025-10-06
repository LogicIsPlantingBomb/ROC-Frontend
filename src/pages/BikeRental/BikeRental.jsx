import React, { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createRentalRequest } from '../../utils/api';
import { Bike, Clock, DollarSign, MapPin, Navigation, ArrowLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for Leaflet default markers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
    html: `<div class="w-8 h-8 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
    iconSize: [32, 32],
    className: 'bike-marker'
});

L.Marker.prototype.options.icon = DefaultIcon;

const BikeRental = () => {
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [position, setPosition] = useState([23.2599, 77.4126]); // Default position (Bhopal)
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rentalRequestPending, setRentalRequestPending] = useState(false);
    const markerRef = useRef(null);

    // Helper function to get latitude and longitude safely
    const getPositionCoordinates = () => {
        if (Array.isArray(position)) {
            return { lat: position[0], lng: position[1] };
        } else if (position && typeof position === 'object') {
            return { 
                lat: position.lat !== undefined ? position.lat : position.lat,
                lng: position.lng !== undefined ? position.lng : position.lng
            };
        }
        return { lat: 23.2599, lng: 77.4126 }; // Fallback to default
    };

    const LocationMarker = () => {
        const map = useMap();
        
        React.useEffect(() => {
            map.locate().on('locationfound', (e) => {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 15);
            });
        }, [map]);

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        setPosition(marker.getLatLng());
                    }
                },
            }),
            [],
        );

        const currentPos = getPositionCoordinates();

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={[currentPos.lat, currentPos.lng]}
                ref={markerRef}
                icon={DefaultIcon}
            />
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!duration || !price) {
            setMessage('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const coords = getPositionCoordinates();
        const rentalData = {
            latitude: coords.lat,
            longitude: coords.lng,
            duration: parseInt(duration, 10),
            price: parseFloat(price),
        };

        try {
            const response = await createRentalRequest(rentalData);
            if (response.success) {
                setRentalRequestPending(true);
                setDuration('');
                setPrice('');
            } else {
                setMessage(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error('API Error:', error);
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    setMessage('Unable to get your current location.');
                }
            );
        }
    };

    const currentPos = getPositionCoordinates();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
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

            <div className="relative z-10 max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Bike className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                            Bike Rental
                        </h1>
                    </div>
                    <p className="text-gray-400">Rent your bike and start earning today</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Map Section */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="font-semibold text-white flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-green-400" />
                                    <span>Select Bike Location</span>
                                </h3>
                                <button
                                    onClick={useCurrentLocation}
                                    className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                >
                                    <Navigation className="w-4 h-4" />
                                    <span>Use Current Location</span>
                                </button>
                            </div>
                            <div className="h-96">
                                <MapContainer 
                                    center={[currentPos.lat, currentPos.lng]} 
                                    zoom={13} 
                                    scrollWheelZoom={true} 
                                    style={{ height: '100%', width: '100%' }}
                                    className="rounded-b-2xl"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                <Target className="w-6 h-6 text-green-400" />
                                <span>Rental Details</span>
                            </h3>

                            {rentalRequestPending ? (
                                <div className="p-6 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-center">
                                    <p className="text-lg font-semibold mb-2">Request Sent!</p>
                                    <p>Your bike rental request has been sent and is awaiting acceptance from a rider.</p>
                                    <p className="text-sm mt-2">You will be notified once a rider accepts your request.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Duration Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            id="duration"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="Rental Duration (minutes)"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            required
                                            min="1"
                                            disabled={rentalRequestPending}
                                        />
                                    </div>

                                    {/* Price Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Price per hour (₹)"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            required
                                            min="1"
                                            step="0.01"
                                            disabled={rentalRequestPending}
                                        />
                                    </div>

                                    {/* Location Display */}
                                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                                        <p className="text-sm text-gray-400 mb-2">Selected Location</p>
                                        <p className="text-white font-mono text-sm">
                                            Lat: {currentPos.lat.toFixed(6)}, Lng: {currentPos.lng.toFixed(6)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Drag the marker on the map to adjust location
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || rentalRequestPending}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                                                <span>Creating Rental...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Bike className="w-5 h-5" />
                                                <span>Create Rental Request</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Message Display */}
                                    {message && (
                                        <div className={`p-4 rounded-xl border ${
                                            message.includes('Error') 
                                                ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                                                : 'bg-green-500/20 border-green-500/30 text-green-300'
                                        }`}>
                                            <p className="text-sm text-center">{message}</p>
                                        </div>
                                    )}
                                </form>
                            )}

                            {/* Help Text */}
                            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <p className="text-xs text-blue-300 text-center">
                                    💡 Your bike will be visible to riders nearby. You'll be notified when someone requests to rent it.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <h4 className="font-semibold text-white mb-1">Earn Money</h4>
                            <p className="text-gray-400 text-sm">Monetize your bike when you're not using it</p>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <h4 className="font-semibold text-white mb-1">Flexible Hours</h4>
                            <p className="text-gray-400 text-sm">Set your own rental duration and pricing</p>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 text-center">
                            <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <h4 className="font-semibold text-white mb-1">Easy Location</h4>
                            <p className="text-gray-400 text-sm">Simple map-based location selection</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeRental;
