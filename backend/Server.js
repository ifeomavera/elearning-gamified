const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');

dotenv.config();
const app = express();

// THIS IS THE FIX: Explicitly trust your Vercel app
app.use(cors({
  origin: [
    'http://localhost:5173',                      // Your computer
    'https://elearning-gamified.vercel.app',      // Your Live Site
    'https://elearning-gamified-paulmasade-rgb.vercel.app' // Your Preview Site
  ],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API is Running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));