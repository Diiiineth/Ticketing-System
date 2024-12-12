import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      Swal.fire({
        title: 'Unauthorized Access',
        text: 'You need to be logged in as an admin to access this page.',
        icon: 'error',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/adminlogin'); // Redirect to the admin login page
      });
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out and redirected to the login page.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the admin token from localStorage
        localStorage.removeItem('admintoken');

        // Redirect to the login page
        navigate('/adminlogin');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img
              src={require('../Admin/img/logo.jpg')}  
              alt="Admin Logo"
              className="w-10 h-10 object-contain rounded-full" 
            />
            <span className="ml-2 text-2xl font-bold">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="flex space-x-6">
          <Link
            to="/users"
            className="text-lg hover:text-blue-300"
          >
            Users
          </Link>
          <Link
            to="/events"
            className="text-lg hover:text-blue-300"
          >
            Events
          </Link>
          {/* Logout Link */}
          <button
            onClick={handleLogout}
            className="text-lg hover:text-blue-300"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
