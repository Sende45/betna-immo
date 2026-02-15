/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https"); // 👈 Commenté pour l'instant
// const logger = require("firebase-functions/logger");       // 👈 Commenté pour l'instant

// Configuration globale pour limiter les coûts
setGlobalOptions({ maxInstances: 10 });

// --- VOS FONCTIONS ICI ---

// Exemple : export const maFonction = ...