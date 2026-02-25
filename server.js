// 1️⃣ Import packages
const express = require("express");
const cors = require("cors");

// 2️⃣ Create app
const app = express();

// 3️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 4️⃣ Sample in-memory storage
let contacts = [];
let messages = [];

// 5️⃣ Routes

// Add Contact
app.post("/add-contact", (req, res) => {
    const { name, phone } = req.body;

    const contact = {
        id: contacts.length + 1,
        name,
        phone
    };

    contacts.push(contact);

    res.json({
        message: "Contact Added Successfully",
        contact
    });
});

// Get Contacts
app.get("/contacts", (req, res) => {
    res.json(contacts);
});

// Send Message
app.post("/send-message", (req, res) => {
    const { contactId, content } = req.body;

    const message = {
        id: messages.length + 1,
        contactId,
        content,
        status: "Sent"
    };

    messages.push(message);

    // Simulate delivery update
    setTimeout(() => {
        message.status = "Delivered";
        console.log("Message Delivered");
    }, 3000);

    res.json({
        message: "Message Sent",
        data: message
    });
});

// Get Messages
app.get("/messages", (req, res) => {
    res.json(messages);
});

// Chatbot
app.post("/chatbot", (req, res) => {
    const { text } = req.body;

    const message = text.toLowerCase().trim();

    let reply = "";

    if (message.includes("hello") || message.includes("hi")) {
        reply = "Hello! How can I help you?";
    }
    else if (message.includes("price")) {
        reply = "Our pricing depends on the service plan. Please contact support.";
    }
    else if (message.includes("service")) {
        reply = "We provide WhatsApp automation and chatbot services.";
    }
    else if (message.includes("help")) {
        reply = "Sure! Please tell me what you need help with.";
    }
    else {
        reply = "Sorry, I didn't understand. Can you rephrase?";
    }

    res.json({ reply });
});
app.listen(5000, () => {
    console.log(`Server started on port 5000`);
});