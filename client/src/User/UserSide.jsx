import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserSide = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');  // Check if the token is available
  const navigate = useNavigate();  // Use navigate to redirect after logout
  const [modalOpen, setModalOpen] = useState(false);  // State to control the modal visibility

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');  // Clear the token from localStorage
        Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
        navigate('/user');  // Redirect to the /user page
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with solid blue background */}
      <header className="bg-blue-600 text-white py-6 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          {/* Logo */}
          <img
            src={require('./img/logo.jpg')} // Replace with your logo path
            alt="Site Logo"
            className="w-12 h-12 object-contain"
          />
          {/* Site Name */}
          <span className="ml-4 text-3xl font-extrabold">EventSphere</span> {/* Site Name */}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-8">
          <Link to="/user" className={`text-lg hover:text-blue-300 transition-all ${location.pathname === '/user' ? 'text-blue-300' : ''}`}>Home</Link>
          <Link to="/user/events" className={`text-lg hover:text-blue-300 transition-all ${location.pathname === '/user/events' ? 'text-blue-300' : ''}`}>Events</Link>
          <Link to="/user/about-us" className={`text-lg hover:text-blue-300 transition-all ${location.pathname === '/user/about-us' ? 'text-blue-300' : ''}`}>About Us</Link>

          {/* Conditionally render Profile or Login/Signup links */}
          {token ? (
            <button 
              onClick={() => setModalOpen(true)}  // Open modal when the profile icon is clicked
              className="text-lg hover:text-blue-300 transition-all"
            >
              <i className="fas fa-user-circle text-xl"></i> {/* Profile Icon */}
            </button>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-lg hover:text-blue-300 transition-all">Login</Link>
              <Link to="/signup" className="text-lg hover:text-blue-300 transition-all">Sign Up</Link>
            </div>
          )}
        </nav>
      </header>

      {/* Conditional Hero Section */}
      {location.pathname === '/user' && (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${require('./img/bg.jpg')})`, height: '900px' }}>
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Slightly darker overlay for contrast */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
            <h1 className="text-5xl font-extrabold mb-4">Welcome to EventSphere</h1>
            <p className="text-xl mb-6">Discover amazing events and experiences around you.</p>
            <Link to="/user/events">
              <button className="bg-blue-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-900 transition-all">
                Explore Events
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Horizontal Cards Section */}
      {location.pathname === '/user' && (
        <section className="px-8 py-12">
          <div className="flex justify-center space-x-8">
            {/* Card 1: Book Ticket */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
              <div className="mb-4">
                <i className="fas fa-ticket-alt text-9xl text-blue-600"></i> {/* Font Awesome Ticket Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Tickets</h3>
              <p className="text-gray-600">Choose your event and book your tickets online with ease.</p>
            </div>

            {/* Card 2: Manage Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
              <div className="mb-4">
                <i className="fas fa-calendar-check text-9xl text-blue-600"></i> {/* Font Awesome Calendar Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
              <p className="text-gray-600">View, modify, or cancel your event bookings in one place.</p>
            </div>

            {/* Card 3: Events Dashboard */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
              <div className="mb-4">
                <i className="fas fa-calendar-day text-9xl text-blue-600"></i> {/* Font Awesome Calendar Icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Events Dashboard</h3>
              <p className="text-gray-600">Browse upcoming events and stay up to date with the latest happenings.</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content (Outlet for child routes) */}
      <main className="p-8">
        <Outlet /> {/* This will render the matched child route component */}
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-600 text-white text-center py-4 mt-12">
        <p className="text-sm">&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
      </footer>

      {/* Modal for Profile and Logout */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Account Options</h2>
            <div className="space-y-4">
              <Link to="/profile" className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg">Profile</Link>
              <button 
                onClick={handleLogout} 
                className="block px-4 py-2 text-lg text-red-600 hover:bg-red-100 w-full text-left rounded-lg"
              >
                Logout
              </button>
            </div>
            <button 
              onClick={() => setModalOpen(false)} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSide;
