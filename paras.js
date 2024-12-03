const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware for parsing JSON data and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://duamohit10:rcmCMgg5rjRrbiNu@mohit.dh99d.mongodb.net/?retryWrites=true&w=majority&appName=Mohit";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected successfully to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// Schema of Form DB
const internshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    qualification: { type: String, required: true },
});

// Creating a Model
const Internship = mongoose.model('Internship', internshipSchema);

// Route to display the form
app.get('/', (req, res) => {
    res.send(`
      <h2>Contact Us</h2>
      <form action="/apply" method="post">
        <!-- Name Input -->
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required>
        <br><br>

        <!-- Email Input -->
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required>
        <br><br>

        <!-- Phone Input -->
        <label for="phone">Phone No:</label>
        <input type="number" id="phone" name="phone" placeholder="Enter your phone number" required>
        <br><br>

        <!-- Qualification Input -->
        <label for="qualification">Qualification:</label>
        <input type="text" id="qualification" name="qualification" placeholder="Enter your qualification" required>
        <br><br>

        <button type="submit">Submit</button>
      </form>
    `);
});

// POST route for handling data submission
app.post('/apply', async (req, res) => {
    const { name, email, phone, qualification } = req.body;

    // Checking if any entry is missing
    if (!name || !email || !phone || !qualification) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Creation of internship document
        const newApplication = new Internship({ name, email, phone, qualification });
        await newApplication.save();

        res.send(`
            <h1>Hi, your application has been submitted!</h1>
            <p>Thank you, ${name}!</p>
        `);
    } catch (err) {
        console.error("Error saving to MongoDB:", err.message);
        res.status(500).send("An error occurred while processing your application.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
