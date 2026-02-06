const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToMongoose = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Connect to MongoDB
connectToMongoose();

// Middlewares
app.use(cors({
    // your React app URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Backend running!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
