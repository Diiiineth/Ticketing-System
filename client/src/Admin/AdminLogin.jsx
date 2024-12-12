import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // For displaying sweet alert messages

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission and login logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/auth/admin-login', {
        email,
        password,
      });

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('admintoken', response.data.token);

        // Display success message
        Swal.fire({
          title: 'Login Successful',
          text: 'You are now logged in as an admin.',
          icon: 'success',
          confirmButtonText: 'Go to Dashboard',
        }).then(() => {
          // Redirect to admin dashboard or other page after success
          window.location.href = '/users'; // You can replace this with your actual dashboard URL
        });
      }
    } catch (error) {
      // Display error message if login fails
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'An error occurred during login.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Left Side - Image */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={require('../Admin/img/login.gif')}
              alt="Admin Image"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Admin Login</h2>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
            
             {/* Sign Up Link */}
             <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="/adminregister" 
                  className="text-blue-600 underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
