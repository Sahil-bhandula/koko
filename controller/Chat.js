const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Appointment = require("../models/Appointment");
const generateSessionId = require("../utils/session");
const { generateVetReply } = require("../utils/gemini");

const sendMESSAGE = async (req, res) => {
    try {
        let { SESSION_ID, MESSAGE, CONTEXT } = req.body;

  

        if (!MESSAGE) {
            return res.status(400).json({ error: "MESSAGE is required" });
        }

        let conversation;

        // session create 
        if (!SESSION_ID) {
            SESSION_ID = generateSessionId();
            conversation = await Conversation.create({
                SESSION_ID,
                CONTEXT: CONTEXT || {},
            });
        } else {
            conversation = await Conversation.findOne({ SESSION_ID });
            if (!conversation) {
                return res.status(400).json({ error: "Invalid SESSION_ID" });
            }
        }

        // save user message
        await Message.create({
            SESSION_ID,
            ROLE: "user",
            TEXT: MESSAGE,
        });

        

        // ongoing appointment
        let appointment = await Appointment.findOne({
            SESSION_ID,
            STATUS: "IN_PROGRESS",
        });

        const msg = MESSAGE.toLowerCase();
        const isAppointmentIntent =
            msg.includes("appointment") ||
            msg.includes("vet visit") ||
            msg.includes("book");

        // start appointment
        if (isAppointmentIntent && !appointment) {
            appointment = await Appointment.create({ SESSION_ID });
            const reply = "Pet owner name?";

            await Message.create({ SESSION_ID, ROLE: "bot", TEXT: reply });
            return res.status(200).json({ reply, SESSION_ID });
        }

        // appointment in progress
        if (appointment) {
            let reply = "";

           
            if (!appointment.OWNER_NAME) {
                appointment.OWNER_NAME = MESSAGE;
                reply = "Pet name?";
            }

            
            else if (!appointment.PET_NAME) {
                appointment.PET_NAME = MESSAGE;
                reply = "Phone number?";
            }

            
            else if (!appointment.PHONE) {
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(MESSAGE)) {
                    reply = "Please enter a valid 10-digit phone number.";
                } else {
                    appointment.PHONE = MESSAGE;
                    reply = "Preferred date & time?";
                }
            }

           
            else if (!appointment.DATETIME) {
                appointment.DATETIME = MESSAGE;
                reply = `
Please confirm appointment:
Owner: ${appointment.OWNER_NAME}
Pet: ${appointment.PET_NAME}
Phone: ${appointment.PHONE}
Date & Time: ${appointment.DATETIME}

Reply YES to confirm.
`;
            }

            //  CONFIRMATION
            else {
                if (msg === "yes") {
                    appointment.STATUS = "CONFIRMED";
                    reply = " Appointment booked successfully!";
                } else {
                    reply = "Appointment cancelled.";
                    await Appointment.deleteOne({ _id: appointment._id });
                }
            }

            await appointment.save();
            await Message.create({ SESSION_ID, ROLE: "bot", TEXT: reply });
            return res.status(200).json({ reply, SESSION_ID });
        }


      

        const botReply = await generateVetReply(MESSAGE);

        await Message.create({
            SESSION_ID,
            ROLE: "bot",
            TEXT: botReply,
        });

        return res.status(200).json({
            reply: botReply,
            SESSION_ID,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat failed" });
    }
};

const getChatHistory = async (req, res) => {
    const { sessionId } = req.query;

    const messages = await Message.find({ SESSION_ID: sessionId })
        .sort({ createdAt: 1 })
        .limit(50);

    res.status(200).json(messages);
};

module.exports = { sendMESSAGE, getChatHistory };
