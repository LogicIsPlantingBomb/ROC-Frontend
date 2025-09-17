import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6">RideOnCabio</h1>
      <p className="text-xl text-gray-600 mb-10">Your ride, your way.</p>
      <div className="flex space-x-6">
        <Link
          to="/user/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition"
        >
          I'm a Rider
        </Link>
        <Link
          to="/captain/login"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition"
        >
          I'm a Captain
        </Link>
      </div>
    </div>
  );
};

export default Home;
