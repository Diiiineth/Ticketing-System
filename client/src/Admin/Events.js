import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Events = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    date: '',
    numberOfTickets: '',
    ticketPrice: '',
    image: null,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admintoken'); // Or sessionStorage, based on your setup
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch all events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/events', {
        headers: getAuthHeaders(),
      });
      setEvents(response.data);
      console.log(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change (image upload)
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Open the form to create or edit events
  const handleToggleForm = (event = null) => {
    if (event) {
      setFormData({
        id: event._id,
        name: event.name,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0], // Format the date
        numberOfTickets: event.numberOfTickets,
        ticketPrice: event.ticketPrice,
        image: null, // Reset image when editing an event
      });
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        date: '',
        numberOfTickets: '',
        ticketPrice: '',
        image: null,
      });
    }
    setIsFormOpen(!isFormOpen);
  };

  // Add new event (POST request)
  const handleAddEvent = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('numberOfTickets', formData.numberOfTickets);
    data.append('ticketPrice', formData.ticketPrice);
    if (formData.image) {
      data.append('image', formData.image);
    }
    console.log(data);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      });
      console.log(response.data);

      Swal.fire('Success!', 'Event added successfully!', 'success');
      fetchEvents(); // Refresh events list
      setIsFormOpen(false); // Close the form
    } catch (error) {
      Swal.fire('Error', 'Failed to add event!', 'error');
    }
  };

  // Update an event (PUT request)
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('numberOfTickets', formData.numberOfTickets);
    data.append('ticketPrice', formData.ticketPrice);
    if (formData.image) {
      data.append('image', formData.image);
    }
  
    try {
      const response = await axios.put(`http://localhost:3001/api/auth/events/${formData.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      });
  
      Swal.fire('Success!', 'Event updated successfully!', 'success');
      fetchEvents(); // Refresh events list
      setIsFormOpen(false); // Close the form
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire('Error', 'You are not authorized to update this event!', 'error');
      } else {
        Swal.fire('Error', 'Failed to update event!', 'error');
      }
    }
  };
  

  // Delete an event (DELETE request)
  const handleDeleteEvent = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/api/auth/events/${id}`, {
            headers: getAuthHeaders(),
          });
          Swal.fire('Deleted!', 'Event has been deleted.', 'success');
          fetchEvents(); // Refresh events list
        } catch (error) {
          if (error.response && error.response.status === 403) {
            Swal.fire('Error', 'You are not authorized to delete this event!', 'error');
          } else {
            Swal.fire('Error', 'Failed to delete event!', 'error');
          }
        }
      }
    });
  };
  

  useEffect(() => {
    fetchEvents(); // Fetch events on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-900 text-white py-4 px-6">
        <h2 className="text-3xl font-semibold">Event Management</h2>
        <button
          onClick={() => handleToggleForm()}
          className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700"
        >
          <FaPlus size={20} />
        </button>
      </div>

      {/* Event Creation/Update Form */}
      {isFormOpen && (
        <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">
              {formData.id ? 'Update Event' : 'Create New Event'}
            </h3>
            <form onSubmit={formData.id ? handleUpdateEvent : handleAddEvent}>
              <div className="mb-4">
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  id="numberOfTickets"
                  name="numberOfTickets"
                  value={formData.numberOfTickets}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">
                  Ticket Price
                </label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eventImage" className="block text-sm font-medium text-gray-700">
                  Event Image
                </label>
                <input
                  type="file"
                  id="eventImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                  {formData.id ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 mx-4">
  <table className="w-full text-sm text-left text-gray-500 bg-white">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3">Event Name</th>
        <th scope="col" className="px-6 py-3">Description</th>
        <th scope="col" className="px-6 py-3">Image</th>
        <th scope="col" className="px-6 py-3">Date</th>
        <th scope="col" className="px-6 py-3">Number of Tickets</th>
        <th scope="col" className="px-6 py-3">Ticket Price</th>
        <th scope="col" className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {events.map((event) => (
        <tr key={event._id} className="border-b">
          <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
          <td className="px-6 py-4">{event.description}</td>
          <td className="px-6 py-4">
            {/* Displaying the event image */}
            <img
              src={`http://localhost:3001${event.image}`} // Ensure the image path is correct
              alt={event.name}
              className="w-24 h-24 object-cover rounded"
            />
          </td>
          <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
          <td className="px-6 py-4">{event.numberOfTickets}</td>
          <td className="px-6 py-4">Rs.{event.ticketPrice.toFixed(2)}</td>
          <td className="px-6 py-4 flex justify-center items-center space-x-2">
            {/* Edit and Delete actions */}
            <button
              onClick={() => handleToggleForm(event)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash size={16} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
  );
};

export default Events;
