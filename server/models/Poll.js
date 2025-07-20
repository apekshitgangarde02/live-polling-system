const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  status: { type: String, default: 'active' }, // active, ended
  createdAt: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdBy: { type: String, required: true }, // socket.id of teacher
  correctAnswer: { type: Number },
});

module.exports = mongoose.model('Poll', pollSchema); 