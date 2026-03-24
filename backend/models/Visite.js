const mongoose = require('mongoose');

const visiteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Bien', required: true },
  propertyTitle: String,
  visitDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['En attente', 'Confirmé', 'Annulé'], 
    default: 'En attente' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visite', visiteSchema);