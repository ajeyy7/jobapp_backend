const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
