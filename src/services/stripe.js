// src/services/stripe.js
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth"; // 💡 AJOUT : Import d'Auth
import { functions } from "../firebase"; // on utilise directement l'instance exportée

// Fonction Firebase callable
const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

// Fonction d'abonnement Stripe
export async function subscribe(priceId) {
  const auth = getAuth(); // 💡 AJOUT : Instance Auth
  const user = auth.currentUser; // 💡 AJOUT : Utilisateur actuel

  // 💡 AJOUT : Vérification de l'authentification
  if (!user) {
    console.error("Utilisateur non connecté");
    alert("Vous devez être connecté pour vous abonner.");
    return;
  }

  if (!priceId) {
    console.error("priceId manquant");
    return;
  }

  try {
    // 💡 AJOUT/MODIF : Les Callable Functions gèrent automatiquement
    // le token si l'utilisateur est connecté via Firebase Auth
    const result = await createCheckoutSession({ priceId });

    if (!result?.data?.url) {
      throw new Error("URL Stripe introuvable");
    }

    // Redirection vers Stripe Checkout
    window.location.href = result.data.url;

  } catch (error) {
    console.error("Erreur abonnement :", error);
    // 💡 MODIF : Affichage de l'erreur réelle pour le debug
    alert(`Impossible de démarrer le paiement : ${error.message}`);
  }
}