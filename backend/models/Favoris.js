const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Bien', required: true },
  propertyTitle: String,
  propertyImage: String,
  price: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.maxModel && mongoose.maxModel.Favoris || mongoose.model('Favoris', favorisSchema);