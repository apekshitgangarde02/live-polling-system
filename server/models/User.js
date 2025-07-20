const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // 'teacher' or 'student'
  socketId: { type: String, required: true, unique: true },
  tabId: { type: String, required: true },
  isConnected: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema); 