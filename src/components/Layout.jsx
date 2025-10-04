import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  const location = useLocation();
  const excludedPaths = ['/user/login', '/user/signup', '/captain/login', '/captain/signup'];
  const showChatbot = !excludedPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {showChatbot && <Chatbot />}
      <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-gray-300 text-center p-4 border-t border-gray-700">
        <div className="container mx-auto">
          <p className="text-sm">
            © 2025 <span className="bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent font-semibold">RideOnCabio</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
