const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

// MongoDB connection
const MONGO_URI = "mongodb+srv://duamohit10:rcmCMgg5rjRrbiNu@mohit.dh99d.mongodb.net/?retryWrites=true&w=majority&appName=Mohit";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Enable JSON parsing
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    console.log("Request Body:", req.body);
    next();
});

// Schemas and Models
const UserSchema = new mongoose.Schema({
    userName: String,
    email: { type: String, unique: true },
    password: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const OrderSchema = new mongoose.Schema({
    items: [{ food: String, quantity: Number, price: Number }],
    total: Number,
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Pending' }
});

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

// Routes

// Register a user
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login a user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure both email and password are provided
        if (!email || typeof email !== "string" || !password || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email, password });

        if (user) {
            return res.status(200).json({ message: "Login successfully", userId: user._id });
        } else {
            return res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ error: "An error occurred on the server" });
    }
});

// Order endpoint
app.post('/order', async (req, res) => {
    if (req.body.userId) {
        try {
            const order = new Order({ ...req.body, orderedBy: req.body.userId });
            await order.save();
            res.status(200).send("Order received");
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(400).send("User is required; otherwise, it is not a valid ID");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
