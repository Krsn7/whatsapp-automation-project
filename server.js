const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Admin Secret
const ADMIN_SECRET = "mysecret123";

// 🟢 Connect to MongoDB
mongoose.connect("mongodb+srv://admin:<mypass1234@cluster0.qrybwik.mongodb.net/whatsappDB?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🟢 Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Contact = mongoose.model("Contact", contactSchema);

// 🟢 Add Contact
app.post("/add-contact", async (req, res) => {
    const { name, phone } = req.body;

    try {
        const newContact = new Contact({ name, phone });
        await newContact.save();

        res.json({
            message: "Contact Added Successfully",
            contact: newContact
        });
    } catch (error) {
        res.status(500).json({ message: "Error saving contact" });
    }
});

// 🟢 Get Contacts (Admin Only)
app.get("/contacts", async (req, res) => {
    const secret = req.headers["admin-secret"];

    if (secret !== ADMIN_SECRET) {
        return res.status(403).json({ message: "Access Denied" });
    }

    const contacts = await Contact.find();
    res.json(contacts);
});

// 🟢 Simple Chatbot
app.post("/chatbot", (req, res) => {
    const { text } = req.body;

    let reply = "Sorry, I didn't understand.";

    if (text.toLowerCase().includes("hello")) {
        reply = "Hi there!";
    }

    res.json({ reply });
});

// 🟢 Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
