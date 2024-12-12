import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import img1 from './img/pro.png';




const EditSupplierModal = ({ supplier, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        firstName: supplier.firstName || '', // Default to empty string if undefined
        lastName: supplier.lastName || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log form data to check values before submission
    console.log('Form Data before submission:', formData);

    try {
        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email) {
            throw new Error('First name, last name, and email are required fields.');
        }

        // Prepare the data as JSON
        const jsonData = {};
        Object.keys(formData).forEach((key) => {
            // Check for undefined values
            if (formData[key] !== undefined) {
                jsonData[key] = formData[key];
            }
        });

        // Make API call to update supplier with JSON data
        await axios.put(`http://localhost:3001/supplier-management/${supplier._id}`, jsonData, {
            headers: {
                'Content-Type': 'application/json', // Set header to application/json
            },
        });

        setSuccessMessage('Supplier updated successfully!');
        onUpdate(); // Refresh the supplier list
        onClose(); // Close the modal
    } catch (error) {
        console.error('Error updating supplier:', error);
        setErrorMessage('Failed to update supplier. Please try again.');
    }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Update Supplier</h2>
        
        {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}
        {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-lg">
            Update Supplier
          </button>
          <button type="button" onClick={onClose} className="ml-2 text-red-500">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};






const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch suppliers from the backend API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/supplier-management/');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this supplier?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/supplier-management/${id}`);
        setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to generate PDF
  const generatePDF = () => {
    const input = document.getElementById('supplier-table');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('suppliers.pdf');
    });
  };

  // Handle edit button click
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier); // Set the selected supplier
    setShowModal(true); // Show the modal
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  const handleUpdate = async () => {
    // Fetch suppliers again after update
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/supplier-management/');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    await fetchSuppliers(); // Await for the fetchSuppliers function
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Suppliers List</h2>

        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border rounded-md"
        />
        <Link to="/admin/create-or-update-supplier">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
            Add New Supplier
          </button>
        </Link>
        <button onClick={generatePDF} className="bg-black text-white px-4 py-2 rounded-lg ml-4">
          Download PDF
        </button>
      </div>

      <table id="supplier-table" className="min-w-full table-auto justify-start mt-14">
        <thead>
          <tr>
            <th className="px-4 py-2 mx-2 bg-gray-100 rounded-2xl">Name</th>
            <th className="px-4 py-2 mx-2 bg-gray-100 rounded-2xl">Email</th>
            <th className="px-4 py-2 bg-gray-100 rounded-2xl">Phone</th>
            <th className="px-4 py-2 bg-gray-100 rounded-2xl">Address</th>
            <th className="px-4 py-2 bg-gray-100 rounded-2xl">Profile Image</th>
            <th className="px-4 py-2 bg-gray-100 rounded-2xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={supplier._id} className="border-b">
              <td className="px-4 py-2">
                {supplier.firstName} {supplier.lastName}
              </td>
              <td className="px-4 py-2">{supplier.email}</td>
              <td className="px-4 py-2">{supplier.phone}</td>
              <td className="px-4 py-2">{supplier.address}</td>
              <td className="px-4 py-2">
                <img
                  src={img1}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="bg-pink-500 text-white px-3 py-1 rounded-lg mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <EditSupplierModal 
          supplier={selectedSupplier} 
          onClose={handleModalClose} 
          onUpdate={handleUpdate} 
        />
      )}
    </div>
  );
};

export default SupplierList;
