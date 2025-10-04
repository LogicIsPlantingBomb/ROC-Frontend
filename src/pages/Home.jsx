import { Link } from 'react-router-dom';
import { Car, Bike, Users, Shield, Clock, Star, MapPin, Zap, Heart, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Instant Rides",
      description: "Book cars, bikes, and autos instantly with real-time tracking",
      color: "from-gray-400 to-gray-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Neighbor Rentals",
      description: "Rent vehicles from your neighbors for longer journeys",
      color: "from-slate-400 to-slate-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Safe",
      description: "Verified drivers and vehicles with comprehensive insurance",
      color: "from-zinc-400 to-zinc-600"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Commuter",
      image: "👩‍💼",
      rating: 5,
      text: "RideOnCabio changed my daily commute. Quick, reliable, and affordable!"
    },
    {
      name: "Raj Kumar",
      role: "Vehicle Owner",
      image: "👨‍🔧",
      rating: 5,
      text: "Earning extra by renting my car to neighbors has never been easier."
    },
    {
      name: "Anjali Patel",
      role: "Student",
      image: "👩‍🎓",
      rating: 5,
      text: "Perfect for weekend trips! Renting bikes from locals is so convenient."
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

      {/* Hero Section */}
      <div className={`relative z-10 px-6 pt-20 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-500 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">
              RideOnCabio
            </h1>
          </div>
          
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-800/50 to-slate-800/50 border border-gray-600/30 rounded-full text-gray-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Now Available in Your City
            </span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-gray-200 via-slate-300 to-gray-400 bg-clip-text text-transparent">
              Your Journey,
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-400 via-gray-300 to-slate-200 bg-clip-text text-transparent">
              Your Way
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Book instant rides or rent vehicles from your neighbors. 
            <br className="hidden md:block" />
            Experience the future of transportation today.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {/* User Section */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">For Riders</h3>
                <p className="text-gray-400 text-sm">Book your ride in seconds</p>
                <div className="space-y-2">
                  <Link
                    to="/user/login"
                    className="block w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Rider Login
                  </Link>
                  <Link
                    to="/user/signup"
                    className="block w-full border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    Sign Up as Rider
                  </Link>
                </div>
              </div>
            </div>

            {/* Captain Section */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500 to-zinc-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-zinc-600 rounded-xl flex items-center justify-center mx-auto">
                  <Car className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">For Drivers</h3>
                <p className="text-gray-400 text-sm">Start earning today</p>
                <div className="space-y-2">
                  <Link
                    to="/captain/login"
                    className="block w-full bg-slate-700 hover:bg-slate-600 text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Driver Login
                  </Link>
                  <Link
                    to="/captain/signup"
                    className="block w-full border border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    Drive with Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Bike Rental Section */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-500 to-gray-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-zinc-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto">
                  <Bike className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">Vehicle Rental</h3>
                <p className="text-gray-400 text-sm">Rent from neighbors</p>
                <div className="space-y-2">
                  <Link
                    to="/bike-rental"
                    className="block w-full bg-zinc-700 hover:bg-zinc-600 text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Rentals
                  </Link>
                  <button className="block w-full border border-zinc-600 text-gray-300 hover:bg-zinc-700 hover:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                    List Your Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">
                Why Choose RideOnCabio?
              </span>
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the perfect blend of convenience, community, and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-black`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-200 mb-4">{feature.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h3>
            <p className="text-xl text-gray-400">Simple steps to get you moving</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-200 mb-2">Choose Your Ride</h4>
                  <p className="text-gray-400">Select from cars, bikes, autos, or browse neighbor rentals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-zinc-600 rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-200 mb-2">Book Instantly</h4>
                  <p className="text-gray-400">Real-time matching with nearby drivers or vehicle owners</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-zinc-500 to-gray-600 rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-200 mb-2">Enjoy Your Journey</h4>
                  <p className="text-gray-400">Track your ride, pay seamlessly, and rate your experience</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-200 mb-4">Live Tracking</h4>
                  <p className="text-gray-400 mb-6">Track your ride in real-time with our advanced GPS system</p>
                  <div className="bg-black/50 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ETA</span>
                      <span className="text-gray-300 font-bold">5 mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
                What People Say
              </span>
            </h3>
            <p className="text-xl text-gray-400">Join thousands of happy customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <h4 className="font-bold text-gray-200">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">
                  Ready to Experience the Future?
                </span>
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Join the RideOnCabio community and transform the way you travel
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/user/signup"
                  className="bg-gradient-to-r from-gray-600 to-slate-700 text-gray-200 px-8 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now
                </Link>
                <button className="border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-200 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-8 h-8 text-gray-400" />
                <span className="text-xl font-bold text-gray-200">RideOnCabio</span>
              </div>
              <p className="text-gray-400">Your journey, your way. Connecting communities through smart transportation.</p>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Instant Rides</li>
                <li>Vehicle Rentals</li>
                <li>Corporate Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Globe className="w-6 h-6 text-gray-400 hover:text-gray-200 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RideOnCabio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
