const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(cors()); // Allows frontend to make requests

// Basic Route for testing removed to serve React app instead



const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Serve frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});