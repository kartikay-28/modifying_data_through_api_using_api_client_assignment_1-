const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./schema.js'); // Fixed the path issue with './'
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection (Updated)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and Price are required',
      });
    }

    const newMenuItem = await MenuItem.create({ name, description, price });
    res.status(201).json({
      success: true,
      message: 'New menu item created successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message,
    });
  }
});

// GET /menu - Retrieve all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
