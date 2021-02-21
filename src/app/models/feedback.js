const mongoose = require('../../database');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;