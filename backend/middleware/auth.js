const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Récupérer le token dans le header "Authorization"
  // Format attendu : "Bearer <TOKEN>"
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun jeton fourni." });
  }

  try {
    // 2. Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Ajouter les infos de l'utilisateur à la requête pour les routes suivantes
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Jeton invalide ou expiré." });
  }
};