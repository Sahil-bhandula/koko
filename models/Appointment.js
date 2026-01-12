
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    SESSION_ID: { type: String, index: true },

    OWNER_NAME: String,
    PET_NAME: String,
    PHONE: String,
    DATETIME: String,

    STATUS: {
      type: String,
      enum: ["IN_PROGRESS", "CONFIRMED"],
      default: "IN_PROGRESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
