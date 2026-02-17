// index.js - Backend complet pour Betna Immo

const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Stripe = require("stripe");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// Initialisation Firebase Admin
admin.initializeApp();

// --- Définition des secrets ---
const STRIPE_SECRET = defineSecret("STRIPE_SECRET");
const GEMINI_KEY = defineSecret("GEMINI_KEY");

// ----------------------------
// FONCTION : Création d'une session Stripe Checkout
// ----------------------------
exports.createCheckoutSession = onCall(
  {
    region: "us-central1",
    secrets: ["STRIPE_SECRET"],
  },
  async (request) => {
    const { auth, data } = request;

    if (!auth) throw new HttpsError("unauthenticated", "Utilisateur non connecté.");
    if (!data || !data.priceId)
      throw new HttpsError("invalid-argument", "priceId manquant.");

    try {
      const stripeKey = await STRIPE_SECRET.value();
      if (!stripeKey) throw new Error("Clé Stripe introuvable");

      const stripe = Stripe(stripeKey, { apiVersion: "2022-11-15" });
      const domain =
        process.env.NODE_ENV === "production"
          ? "https://betna-immo.vercel.app"
          : "http://localhost:5173";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: data.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${domain}/success`,
        cancel_url: `${domain}/cancel`,
        customer_email: auth.token.email,
        metadata: { userId: auth.uid },
      });

      if (!session.url) throw new Error("Impossible de récupérer l'URL de session");
      return { url: session.url };
    } catch (error) {
      console.error("Erreur Stripe :", error);
      throw new HttpsError("internal", error.message || "Erreur interne Stripe");
    }
  }
);

// ----------------------------
// FONCTION : Analyse de description d'un bien avec Gemini
// ----------------------------
exports.analyzeBienDescription = onRequest(
  {
    region: "us-central1",
    secrets: ["GEMINI_KEY"],
  },
  async (req, res) => {
    try {
      const geminiKey = await GEMINI_KEY.value();
      if (!geminiKey) throw new Error("Clé Gemini introuvable");

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const description = req.body.description;
      if (!description) {
        res.status(400).send("Description manquante.");
        return;
      }

      const prompt = `
Tu es un expert immobilier en Côte d'Ivoire 😎🏡

Analyse cette description et retourne uniquement un JSON valide avec ce format :
{
  "resume": "Résumé accrocheur en une phrase",
  "points_forts": ["Point fort 1", "Point fort 2", "..."],
  "type_bien": "Appartement | Villa | Maison",
  "cible": "famille | investisseur | jeune professionnel"
}

Description :
${description}
`;

      const result = await model.generateContent(prompt);
      let text = (await result.response).text();
      if (!text) throw new Error("Réponse vide de Gemini");

      // Nettoyage si Gemini ajoute des balises
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        res.status(500).send("Réponse Gemini non JSON : " + text);
        return;
      }

      res.status(200).json(parsed);
    } catch (error) {
      console.error("Erreur Gemini :", error);
      res.status(500).send("Erreur lors de l'analyse.");
    }
  }
);

// ----------------------------
// FONCTION : Chat Assistant Immobilier Ludique
// ----------------------------
exports.chatAssistant = onRequest(
  {
    region: "us-central1",
    secrets: ["GEMINI_KEY"],
  },
  async (req, res) => {
    try {
      const { userId, message } = req.body;

      if (!userId || !message) {
        return res.status(400).json({ error: "userId ou message manquant" });
      }

      const db = admin.firestore();

      // 1️⃣ Récupérer l'historique récent (max 10 messages)
      const messagesRef = db
        .collection("conversations")
        .doc(userId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(10);

      const snapshot = await messagesRef.get();
      const history = [];
      snapshot.forEach(doc => {
        history.unshift(doc.data()); // ordre chrono
      });

      // 2️⃣ Construire le prompt ludique pour Gemini
      let historyText = history.map(m => `${m.role}: ${m.text}`).join("\n");
      historyText += `\nuser: ${message}`;

      const prompt = `
Tu es un conseiller immobilier expert en Côte d'Ivoire 😎🏡
Ton rôle :
- comprendre le besoin utilisateur
- poser des questions si nécessaire
- extraire les critères immobiliers
- guider l'utilisateur de façon ludique et amicale avec emojis

Fais toujours un JSON avec ce format :
{
  "message": "réponse naturelle à afficher",
  "criteria": {
    "type": "",
    "ville": "",
    "budget": "",
    "chambres": "",
    "objectif": "achat | location | investissement"
  },
  "next_question": ""
}

Conversation précédente :
${historyText}
`;

      // 3️⃣ Appel à Gemini
      const geminiKey = await GEMINI_KEY.value();
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      let text = (await result.response).text();

      // 4️⃣ Parser JSON côté serveur (toujours un objet)
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = {
          message: text,
          criteria: { type: "", ville: "", budget: "", chambres: "", objectif: "" },
          next_question: ""
        };
      }

      // 5️⃣ Stocker le message utilisateur + réponse IA
      const now = admin.firestore.FieldValue.serverTimestamp();
      await db.collection("conversations").doc(userId).collection("messages").add({
        role: "user",
        text: message,
        timestamp: now
      });
      await db.collection("conversations").doc(userId).collection("messages").add({
        role: "assistant",
        text: parsed.message,
        timestamp: now
      });

      // 6️⃣ Envoyer la réponse JSON au frontend
      res.json(parsed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur chatAssistant" });
    }
  }
);
