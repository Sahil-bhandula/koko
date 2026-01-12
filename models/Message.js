const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    SESSION_ID: {
      type: String,
      required: true,
      index: true,
    },
    ROLE: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    TEXT: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


MessageSchema.index({ SESSION_ID: 1, createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);
