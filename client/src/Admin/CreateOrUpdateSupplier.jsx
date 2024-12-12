import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import supplierImage from './img/sup.gif';

const CreateSupplier = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage(''); // Clear message when user changes input
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before submission
    if (!validateForm()) return;

    // Prepare the data as JSON
    const jsonData = { ...formData };

    try {
      // Make API call to submit data as JSON
      const response = await axios.post('http://localhost:3001/supplier-management/', jsonData, {
        headers: {
          'Content-Type': 'application/json', // Set header to application/json
        },
      });

      if (response.status === 201) { // Assuming a successful creation returns a 201 status
        setMessage('Supplier created successfully!'); // Set success message
        onSubmit(); // Execute onSubmit function
        navigate('/admin/manage-proteins'); // Navigate to the desired page
      } else {
        setMessage('Error creating supplier. Please try again.'); // Handle unexpected responses
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage('Error creating supplier. Please try again.'); // Set error message
    }
  };

  const handleCancel = () => {
    navigate('/admin/manage-proteins');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex max-w-5xl mx-auto p-6 border shadow-2xl rounded-2xl">
        {/* Image Section */}
        <div className="w-1/2 flex justify-center items-center mb-[20px]">
          <img src={supplierImage} alt="Supplier" className="w-full h-auto object-cover rounded-l-2xl" />
        </div>

        {/* Form Section */}
        <div className="w-1/2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Supplier</h2>
            <button type="button" onClick={handleCancel} className="text-red-500">
              &#x2716; {/* Cancel icon */}
            </button>
          </div>

          {message && <p className={`text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>} {/* Display message */}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-lg m-4">
              Create Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;
