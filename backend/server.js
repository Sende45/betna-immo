const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Serveur Betna Immo démarré !
  📡 Port: ${PORT}
  🌍 URL: http://localhost:${PORT}
  `);
});

// Gestion des erreurs de fermeture propre (optionnel mais recommandé)
process.on('unhandledRejection', (err) => {
  console.log(`❌ Erreur critique: ${err.message}`);
  server.close(() => process.exit(1));
});