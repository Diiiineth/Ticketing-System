import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch events from the server using Axios
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleBookNow = (event) => {
    const token = localStorage.getItem('token');  // Assuming token is stored in localStorage

    if (!token) {
      Swal.fire({
        title: 'You need to be logged in',
        text: 'Please log in to book tickets.',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/login');
      });
    } else {
      Swal.fire({
        title: 'Select Number of Tickets and Level',
        html: `
          <input type="number" id="tickets" class="swal2-input" placeholder="Number of tickets" min="1" />
          <select id="level" class="swal2-input">
            <option value="golden">Golden</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const tickets = document.getElementById('tickets').value;
          const level = document.getElementById('level').value;
          return { tickets, level };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { tickets, level } = result.value;

          // Call your API to save the booking or show a success message
          Swal.fire(
            'Success!',
            `You have successfully booked ${tickets} tickets in ${level} level for the ${event.name} event.`,
            'success'
          );
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300 ease-in-out group"
          >
            <img
              src={`http://localhost:3001${event.image}`} // Assuming image URL is stored as a relative path
              alt={event.name}
              className="w-full h-56 object-cover transition-all duration-300 ease-in-out group-hover:opacity-80"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{event.name}</h3>
              <p className="text-lg text-gray-600 mb-4">{event.description}</p>

              <div className="mb-4">
                <p className="text-md text-gray-600 font-medium">
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-md text-gray-600 font-medium">
                  <strong>Tickets Available:</strong> {event.numberOfTickets}
                </p>
                <p className="text-md text-gray-600 font-medium">
                  <strong>Price per Ticket:</strong> ${event.ticketPrice}
                </p>
              </div>

              <button 
                onClick={() => handleBookNow(event)}  
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
