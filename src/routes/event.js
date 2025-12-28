const express = require("express");
const Event = require("../models/Event");
const Reservation = require("../models/Reservation");

const router = express.Router();

/**
 * GET /event
 */
router.get("/", async (req, res) => {
  const event = await Event.findOne({ eventId: "node-meetup-2025" });
  
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const reservationCount = await Reservation.countDocuments({ status: "confirmed" });

  res.json({
    eventId: event.eventId,
    name: event.name,
    totalSeats: event.totalSeats,
    availableSeats: event.availableSeats,
    reservationCount,
    version: event.version
  });
});

module.exports = router;
