const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  reservationId: { type: String, unique: true },
  partnerId: String,
  seats: Number,
  eventId: String, // Track which event this reservation is for
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", reservationSchema);
