const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    SESSION_ID: {
      type: String,
      required: true,
      unique: true,
      
    },
    CONTEXT: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
