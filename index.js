require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");



// Enable CORS
const cors = require("cors");

app.use(cors());

// Middleware
app.use(express.json()); // parse JSON bodies

app.use(express.static(path.join(__dirname, "public")));

// Connect Database
connectDB();




const Chat = require("./router/chat");
app.use("/KOKO/Message", Chat);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});