import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import { Link } from 'react-router-dom';  // Import the Link component for routing

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/admin-register', {
        email,
        password
      });

      if (response.status === 201) {
        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'You have successfully signed up as an Admin.',
        }).then(() => {
          // Redirect to login page after success
          navigate('/adminlogin');  // Navigate to the login page for admin
        });

        // Optionally, reset form fields here
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      // Handle error
      if (err.response) {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: err.response.data.message || 'Something went wrong. Please try again.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Network error. Please check your connection.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Left Side - Image */}
          <div className="w-1/2 flex items-center justify-center">
            <img 
              src={require('./img/adreg.png')}  // You can change the image path here
              alt="Signup Image" 
              className="object-cover w-full h-full" 
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Admin Signup</h2>
            
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
                Sign Up
              </button>
            </form>

            {/* Link to Login page */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                If you already have an account, 
                <Link to="/adminlogin" className="text-blue-600 underline hover:text-blue-800"> Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
