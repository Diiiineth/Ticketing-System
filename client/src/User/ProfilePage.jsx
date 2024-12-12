import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);  // Initialize state to store user data
  const [loading, setLoading] = useState(true);   // State to manage loading state
  const [error, setError] = useState(null);       // State to manage errors

  useEffect(() => {
    // Function to fetch user data from the server using the token in headers
    const fetchUserProfile = async () => {
      try {
        // Get the token from localStorage (assuming it's stored there)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3001/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
          },
        });

        setUserData(response.data);  // Set user data received from the API
        setLoading(false);            // Set loading to false once data is fetched
      } catch (error) {
        setError(error.message);      // Set error if any occurs
        setLoading(false);            // Set loading to false on error
      }
    };

    fetchUserProfile();  // Call the function to fetch the user profile
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{`Error: ${error}`}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Left Side - GIF */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={require('./img/profile.gif')} // Replace with your GIF URL
              alt="User Avatar"
              className="object-cover w-full h-full rounded-lg shadow-md"
            />
          </div>

          {/* Right Side - Profile Information */}
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Profile</h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={userData.fullName}
                  readOnly
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  readOnly
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => window.history.back()} // Go back to the previous page
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
