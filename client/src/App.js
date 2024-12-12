import './App.css';
import CreateOrUpdateSupplier from './Admin/CreateOrUpdateSupplier';
import ManageSuppliers from './Admin/ManageSuppliers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes instead of Switch
import AdminPanel from './Admin/AdminPanel';
import Users from './Admin/Users';
import Events from './Admin/Events';
import AdminLogin from './Admin/AdminLogin';
import UserSide from './User/UserSide'; // Import UserSide component
import AboutUs from './User/AboutUs'; // Import AboutUs component
import EventsPage from './User/Events'; // Import Events component
import UserSignup from './User/UserSignup'; // Import UserSignup component
import UserLogin from './User/UserLogin'; // Import UserLogin component
import ProfilePage from './User/ProfilePage';
import AdminSignup from './Admin/AdminSignup';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Admin Panel Routes */}
          <Route path="/" element={<AdminPanel />}>
            <Route path="users" element={<Users />} />
            <Route path="events" element={<Events />} />
          </Route>
          
          {/* Admin Login Route */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminregister" element={<AdminSignup />} />

          {/* User Side Routes */}
          <Route path="/user" element={<UserSide />}>
            <Route path="events" element={<EventsPage />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>

          {/* User Auth Routes */}
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
