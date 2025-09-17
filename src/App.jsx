import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import UserLogin from './pages/User/UserLogin';
import UserSignup from './pages/User/UserSignup';
import UserProfile from './pages/User/UserProfile';
import CaptainLogin from './pages/Captain/CaptainLogin';
import CaptainSignup from './pages/Captain/CaptainSignup';
import CaptainProfile from './pages/Captain/CaptainProfile';
import UserHome from './pages/User/UserHome';
import CaptainHome from './pages/Captain/CaptainHome';
// Context Providers
import { UserProvider } from './contexts/UserContext';
import { CaptainProvider } from './contexts/CaptainContext';

function App() {
  return (
    <UserProvider>
      <CaptainProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* User Routes */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute role="user">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
	      <Route path="/user/user-home" element={
		      		<ProtectedRoute role="user">
		      			<UserHome />
		      		</ProtectedRoute>
	      } />

              {/* Captain Routes */}
              <Route path="/captain/login" element={<CaptainLogin />} />
              <Route path="/captain/signup" element={<CaptainSignup />} />
              <Route
                path="/captain/profile"
                element={
                  <ProtectedRoute role="captain">
                    <CaptainProfile />
                  </ProtectedRoute>
                }
              />
	  	<Route path="/captain/captain-home" element={ 
			<ProtectedRoute role="captain">
				<CaptainHome />
			</ProtectedRoute>
	  	} />
            </Routes>
          </Layout>
        </Router>
      </CaptainProvider>
    </UserProvider>
  );
}

export default App;
