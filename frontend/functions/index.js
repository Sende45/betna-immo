const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Stripe = require("stripe");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

admin.initializeApp();

// Définition des secrets
const STRIPE_SECRET = defineSecret("STRIPE_SECRET");
const GEMINI_KEY = defineSecret("GEMINI_KEY");

/**
 * Utilitaire pour nettoyer et parser le JSON venant de Gemini
 */
const safeParseJSON = (text) => {
  try {
    // Supprime les blocs de code Markdown si présents
    const cleanText = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Échec du parsing JSON Gemini:", text);
    return null;
  }
};

// ----------------------------
// 💳 STRIPE : Création de Session
// ----------------------------
exports.createCheckoutSession = onCall(
  {
    region: "us-central1",
    secrets: [STRIPE_SECRET],
  },
  async (request) => {
    const { auth, data } = request;

    if (!auth) throw new HttpsError("unauthenticated", "Utilisateur non connecté.");
    if (!data?.priceId) throw new HttpsError("invalid-argument", "priceId manquant.");

    try {
      const stripe = Stripe(STRIPE_SECRET.value());
      const domain = process.env.NODE_ENV === "production"
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

      return { url: session.url };
    } catch (error) {
      throw new HttpsError("internal", error.message);
    }
  }
);

// ----------------------------
// 🏠 GEMINI : Analyse de Bien
// ----------------------------
exports.analyzeBienDescription = onRequest(
  {
    region: "us-central1",
    secrets: [GEMINI_KEY],
    cors: true, 
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") return res.status(405).send("Méthode non autorisée");
      
      const { description } = req.body;
      if (!description) return res.status(400).send("Description manquante.");

      const genAI = new GoogleGenerativeAI(GEMINI_KEY.value());
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `Tu es un expert immobilier en Côte d'Ivoire 😎🏡. Analyse cette description et retourne un JSON :
      {
        "resume": "Résumé accrocheur",
        "points_forts": ["..."],
        "type_bien": "Appartement | Villa | Maison",
        "cible": "famille | investisseur | jeune professionnel"
      }
      Description : ${description}`;

      const result = await model.generateContent(prompt);
      const data = safeParseJSON(result.response.text());

      res.status(200).json(data || { error: "Erreur de formatage IA" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ----------------------------
// 💬 GEMINI : Chat Assistant
// ----------------------------
exports.chatAssistant = onRequest(
  {
    region: "us-central1",
    secrets: [GEMINI_KEY],
    cors: true,
  },
  async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) return res.status(400).json({ message: "Données manquantes" });

      const db = admin.firestore();
      
      // 1. Récupération historique
      const snapshot = await db.collection("conversations").doc(userId).collection("messages")
        .orderBy("timestamp", "desc").limit(10).get();
      const history = snapshot.docs.reverse().map(doc => doc.data());

      // 2. IA Configuration
      const genAI = new GoogleGenerativeAI(GEMINI_KEY.value());
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `Tu es un conseiller immobilier expert en Côte d'Ivoire 😎🏡.
      Réponds en JSON uniquement :
      {
        "message": "ta réponse ludique avec questions",
        "criteria": { "type": "", "ville": "", "budget": "", "chambres": "", "objectif": "" },
        "next_question": "prochaine étape"
      }
      Historique : ${history.map(m => `${m.role}: ${m.text}`).join("\n")}
      User: ${message}`;

      const result = await model.generateContent(prompt);
      const parsed = safeParseJSON(result.response.text()) || { 
        message: "Oups, je m'emmêle les pinceaux ! 🏡 Reessayons ?", 
        criteria: {}, next_question: "Votre budget ?" 
      };

      // 3. Sauvegarde Firestore asynchrone (ne bloque pas la réponse)
      const now = admin.firestore.FieldValue.serverTimestamp();
      const msgCol = db.collection("conversations").doc(userId).collection("messages");
      
      await msgCol.add({ role: "user", text: message, timestamp: now });
      await msgCol.add({ role: "assistant", text: parsed.message, timestamp: now });

      res.status(200).json(parsed);

    } catch (error) {
      console.error("Global Chat Error:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);