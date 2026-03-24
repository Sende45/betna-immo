const app = require('./app');

// 1. Render injecte dynamiquement le PORT. 
// Forcer '0.0.0.0' est INDISPENSABLE sur Render pour l'écoute réseau.
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; 

const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Serveur Betna Immo opérationnel !
  📡 Port: ${PORT}
  🌍 Mode: ${process.env.NODE_ENV || 'development'}
  `);
});

// 2. Gestion propre des erreurs
process.on('unhandledRejection', (err) => {
  console.error(`❌ Erreur critique détectée : ${err.name}, ${err.message}`);
  // On ferme proprement avant de quitter
  server.close(() => {
    process.exit(1);
  });
});

// 3. Gestion du signal de terminaison (Recommandé pour Render/Heroku)
process.on('SIGTERM', () => {
  console.info('SIGTERM reçu. Fermeture du serveur HTTP...');
  server.close(() => {
    console.log('Serveur HTTP fermé.');
  });
});