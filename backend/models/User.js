const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['client', 'proprietaire', 'admin'], default: 'client' },
  subscription: {
    plan: { type: String, default: 'aucun' },
    actif: { type: Boolean, default: false },
    dateDebut: Date,
    dateFin: Date
  },
  createdAt: { type: Date, default: Date.now }
});

// Hachage du mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', UserSchema);