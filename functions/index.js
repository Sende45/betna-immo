// functions/index.js
const functions = require("firebase-functions");
const Stripe = require("stripe");
// 💡 AJOUT : Chargement du fichier .env situé dans le dossier functions
require('dotenv').config();

// 💡 CORRECTION : Utilisation de process.env.STRIPE_SECRET
const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error("⚠️ La variable d'environnement STRIPE_SECRET n'est pas définie dans le fichier .env !");
}

const stripe = Stripe(stripeSecret, { 
    apiVersion: '2022-11-15' 
});

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Vérification de l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être connecté pour s'abonner."
    );
  }

  // Vérification des données reçues
  if (!data || !data.priceId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Le paramètre priceId est obligatoire."
    );
  }

  const userEmail = context.auth.token.email;
  if (!userEmail) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Impossible de récupérer l'adresse email de l'utilisateur."
    );
  }

  try {
    // 💡 Détecter l'environnement pour changer les URLs
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? "https://ton-site.com" : "http://localhost:5173";

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: data.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${domain}/success`,
      cancel_url: `${domain}/cancel`,
      customer_email: userEmail,
      metadata: { userId: context.auth.uid },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Erreur createCheckoutSession:", error);
    throw new functions.https.HttpsError("internal", error.message || "Erreur Stripe inconnue");
  }
});