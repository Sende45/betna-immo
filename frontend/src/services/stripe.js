import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebase"; // ✅ on importe AUTH depuis firebase.js

// Fonction Firebase callable
const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

// Fonction d'abonnement Stripe
export async function subscribe() {
  const user = auth.currentUser; // ✅ utilise l'instance déjà initialisée
  
  // 💡 VOTRE PRICE ID STRIKE
  const priceId = "price_1T1UQDIImwaKuwtjDahtEQdK";

  // Vérification de l'authentification
  if (!user) {
    console.error("Utilisateur non connecté");
    alert("Vous devez être connecté pour vous abonner.");
    return;
  }

  try {
    // (optionnel mais recommandé) force Firebase à envoyer un token frais
    await user.getIdToken(true);

    // 🚀 Appel de la fonction Firebase avec le priceId en dur
    const result = await createCheckoutSession({ priceId });

    if (!result?.data?.url) {
      throw new Error("URL Stripe introuvable");
    }

    // Redirection vers Stripe Checkout
    window.location.href = result.data.url;

  } catch (error) {
    console.error("Erreur abonnement :", error);
    alert(`Impossible de démarrer le paiement : ${error.message}`);
  }
}