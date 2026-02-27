const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔐 Admin Secret (Change this if you want)
const ADMIN_SECRET = "mysecret123";

// ===============================
// 🟢 MongoDB Connection
// ===============================

const MONGO_URI = "mongodb+srv://admin:mypass1234@cluster0.qrybwik.mongodb.net/whatsappDB?retryWrites=true&w=majority"; 
// Example format:
// mongodb+srv://admin:Password123@cluster0.xxxxx.mongodb.net/whatsappDB?retryWrites=true&w=majority

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log("Error Message:", err.message);
});

// ===============================
// 🟢 Contact Schema
// ===============================

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model("Contact", contactSchema);

// ===============================
// 🟢 Routes
// ===============================

// Add Contact
app.post("/add-contact", async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "Name and phone are required"
            });
        }

        const newContact = new Contact({
            name,
            phone
        });

        await newContact.save();

        res.json({
            message: "Contact Added Successfully",
            contact: newContact
        });

    } catch (error) {
        console.log("Add Contact Error:", error.message);
        res.status(500).json({
            message: "Error saving contact"
        });
    }
});

// Get Contacts (Admin Only)
app.get("/contacts", async (req, res) => {
    try {
        const secret = req.headers["admin-secret"];

        if (secret !== ADMIN_SECRET) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

        const contacts = await Contact.find();
        res.json(contacts);

    } catch (error) {
        console.log("Get Contacts Error:", error.message);
        res.status(500).json({
            message: "Error fetching contacts"
        });
    }
});

// Simple Chatbot
app.post("/chatbot", (req, res) => {
    const { text } = req.body;

    let reply = "Sorry, I didn't understand.";

    if (text && text.toLowerCase().includes("hello")) {
        reply = "Hi there!";
    }

    res.json({ reply });
});

// ===============================
// 🟢 Start Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
