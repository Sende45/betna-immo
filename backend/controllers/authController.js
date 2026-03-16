const User = require('..User/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Inscription (Register)
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // Le hachage du mot de passe est géré automatiquement par le middleware .pre('save') du modèle User
    user = new User({ email, password, fullName, phone, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// ✅ Connexion (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Identifiants invalides." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Identifiants invalides." });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// ✅ Profil actuel (Get Me)
exports.getMe = async (req, res) => {
  try {
    // req.user.id est injecté par le middleware 'auth'
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};