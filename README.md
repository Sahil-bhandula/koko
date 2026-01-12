Veterinary Chatbot Backend

This repository contains the backend service for the Veterinary Chatbot SDK.
It handles AI-powered veterinary responses, conversational appointment booking, and data persistence.

The backend is designed to be consumed by a script-based chatbot SDK that can be embedded into any website.

Tech Stack

Node.js

Express.js

MongoDB

Google Gemini API

Responsibilities of the Backend

Receive user chat messages from the SDK

Generate veterinary-specific AI responses using Gemini

Restrict responses to pet and animal care topics only

Detect and manage appointment booking conversations

Store conversations and appointments in MongoDB

API Overview
1. Send Message

POST /KOKO/Message/send

Handles user messages and returns bot responses.

Request Body

{
  "sessionId": "optional-session-id",
  "MESSAGE": "User message",
  "context": {
    "userId": "user_123",
    "userName": "John",
    "petName": "Buddy",
    "source": "website"
  }
}


Behavior

Creates a new session if sessionId is not provided

Stores both user and bot messages

Routes message to:

AI response flow, or

Appointment booking flow (if intent detected)

2. Conversation History

GET /KOKO/Message/history

Query Params

sessionId=<session-id>


Returns stored conversation messages for a session.

AI Guardrails

The backend enforces veterinary-only responses using a system prompt.

Behavior

Answers only pet and animal health related questions

Politely refuses non-veterinary questions

Prevents general-purpose or unrelated responses

This ensures predictable and safe chatbot behavior.

Appointment Booking Flow

The backend detects appointment intent using simple keyword matching.

Required Fields

Pet Owner Name

Pet Name

Phone Number

Preferred Date & Time

Flow

Detect booking intent

Ask for missing details one at a time

Validate basic inputs

Confirm details

Save appointment to MongoDB

Each appointment is linked to the corresponding conversation session.

Data Storage
Conversations

Stored with:

Session ID

Messages (user + bot)

Timestamps

Optional context from the SDK

Appointments

Stored with:

Owner details

Pet details

Contact number

Preferred date & time

Linked session ID

Created timestamp

Environment Variables

Create a .env file in the backend root:

PORT=8080
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key