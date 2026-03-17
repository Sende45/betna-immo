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

// ✅ CORRECTION : Hachage du mot de passe (Middleware Async)
// Dans une fonction async, Mongoose n'a plus besoin du paramètre 'next'
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    throw new Error('Erreur lors du hachage du mot de passe');
  }
});

module.exports = mongoose.model('User', UserSchema);