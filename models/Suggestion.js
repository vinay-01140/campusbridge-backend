const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  title: { type: String },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending','reviewed','in_progress','resolved'], default: 'pending' },
  comments: [{
    text: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
