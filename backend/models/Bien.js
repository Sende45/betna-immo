const mongoose = require('mongoose');

const BienSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [String],
  typeSejour: { type: String, enum: ['court', 'long'], default: 'court' },
  status: { type: String, default: 'Vérifié' }, // Ce que tu affiches sur ton image
  amenities: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bien', BienSchema);