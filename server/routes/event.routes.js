const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { auth } = require('../middlewares/auth');

// Route to create an event with image upload
router.post('/events',auth, eventController.createEvent);

// Route to get all events
router.get('/events', eventController.getAllEvents);

// Route to get event by ID
router.get('/events/:id', eventController.getEventById);

// Route to update event by ID with image upload
router.put('/events/:id',auth, eventController.updateEvent);

// Route to delete event by ID
router.delete('/events/:id',auth, eventController.deleteEvent);

module.exports = router;
