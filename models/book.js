const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  status: {
    type: String,
    enum: ['read', 'reading', 'planned'],
    default: 'planned',
  },
  thumbnail: String, // URL to thumbnail image
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);