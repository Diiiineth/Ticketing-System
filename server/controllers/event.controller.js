const Event = require('../models/event.model');
const multer = require('multer');
const path = require('path');

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter (optional: only allow image files)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('image'); // Accepts a single image file

// Create a new event
exports.createEvent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { name, description, date, numberOfTickets, ticketPrice } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null; // Save image path

      const eventDate = new Date(date);

      // Use req.user.id as the createdBy field
      const newEvent = new Event({
        name,
        description,
        image,
        date: eventDate,
        numberOfTickets,
        ticketPrice,
        createdBy: req.user.id, // Associating the event with the logged-in user
      });

      await newEvent.save();
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating event', error });
    }
  });
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching events', error });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching event', error });
  }
};

// Get events by the logged-in user (based on req.user.id)
exports.getUserEvents = async (req, res) => {
  try {
    const userEvents = await Event.find({ createdBy: req.user.id });
    if (userEvents.length === 0) {
      return res.status(404).json({ message: 'No events found for this user' });
    }
    res.status(200).json(userEvents);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user events', error });
  }
};

// Update event by ID (only if the user is the creator)
exports.updateEvent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { name, description, date, numberOfTickets, ticketPrice } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const eventDate = new Date(date);

      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if the logged-in user is the creator of the event
      if (event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this event' });
      }

      // Proceed with the update if the user is the creator
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { name, description, date: eventDate, numberOfTickets, ticketPrice, image },
        { new: true }
      );

      res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
      res.status(400).json({ message: 'Error updating event', error });
    }
  });
};

// Delete event by ID (only if the user is the creator)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the logged-in user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Proceed with deletion if the user is the creator
    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event', error });
  }
};
