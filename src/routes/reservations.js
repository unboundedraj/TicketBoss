const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Event = require("../models/Event");
const Reservation = require("../models/Reservation");

const router = express.Router();

/**
 * POST /reservations
 */
router.post("/", async (req, res) => {
  const { partnerId, seats } = req.body;

  // Validation (as per spec)
  if (!seats || seats <= 0 || seats > 10) {
    return res.status(400).json({ error: "Seats must be between 1 and 10" });
  }

  // Atomic seat reservation
  const event = await Event.findOneAndUpdate(
    {
      eventId: "node-meetup-2025",
      availableSeats: { $gte: seats }
    },
    {
      $inc: { availableSeats: -seats, version: 1 }
    },
    { new: false }
  );

  // Not enough seats
  if (!event) {
    return res.status(409).json({ error: "Not enough seats left" });
  }

  // Create reservation
  const reservation = await Reservation.create({
    reservationId: uuidv4(),
    partnerId,
    seats,
    eventId: "node-meetup-2025",
    status: "confirmed"
  });

  return res.status(201).json({
    reservationId: reservation.reservationId,
    seats,
    status: "confirmed"
  });
});


/**
 * DELETE /reservations/:id
 */
router.delete("/:id", async (req, res) => {
  const reservation = await Reservation.findOne({
    reservationId: req.params.id,
    status: "confirmed"
  });

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  // Restore seats atomically
  await Event.updateOne(
    { eventId: "node-meetup-2025" },
    { $inc: { availableSeats: reservation.seats, version: 1 } }
  );

  // Cancel reservation
  reservation.status = "cancelled";
  await reservation.save();

  return res.status(204).send();
});


/**
 * GET /reservations
 */
router.get("/", async (req, res) => {
  const reservations = await Reservation.find();
  res.json(reservations);
});

module.exports = router;
