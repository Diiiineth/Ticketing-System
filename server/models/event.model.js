const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store image URL or file path
   
  },
  date: {
    type: Date,
    required: true, // Store the actual date of the event
  },
  numberOfTickets: {
    type: Number,
    required: true, // Specify the number of tickets available for the event
    min: [0, 'Number of tickets cannot be less than 0'], // Ensure no negative values
  },
  ticketPrice: {
    type: Number,
    required: true, // Specify the price of each ticket
    min: [0, 'Ticket price cannot be less than 0'], // Ensure no negative prices
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true, // Ensure the event has an associated user
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
