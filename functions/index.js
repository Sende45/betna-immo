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
    cors: true,
  },
  async (req, res) => {
    try {
      const geminiKey = await GEMINI_KEY.value();
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const description = req.body.description;
      if (!description) return res.status(400).send("Description manquante.");

      const prompt = `
Tu es un expert immobilier en Côte d'Ivoire 😎🏡
Analyse cette description et retourne uniquement un JSON valide :
{
  "resume": "Résumé accrocheur",
  "points_forts": ["..."],
  "type_bien": "Appartement | Villa | Maison",
  "cible": "famille | investisseur | jeune professionnel"
}
Description : ${description}`;

      const result = await model.generateContent(prompt);
      let text = (await result.response).text();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      res.status(200).json(JSON.parse(text));
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
    cors: true,
  },
  async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) return res.status(400).json({ error: "Données manquantes" });

      const db = admin.firestore();
      
      // 1️⃣ Historique
      const snapshot = await db.collection("conversations").doc(userId).collection("messages")
        .orderBy("timestamp", "desc").limit(10).get();
      
      const history = [];
      snapshot.forEach(doc => history.unshift(doc.data()));

      // 2️⃣ Prompt
      let historyText = history.map(m => `${m.role}: ${m.text}`).join("\n");
      const prompt = `
Tu es un conseiller immobilier expert en Côte d'Ivoire 😎🏡. Réponds de façon ludique en JSON :
{
  "message": "réponse",
  "criteria": { "type": "", "ville": "", "budget": "", "chambres": "", "objectif": "" },
  "next_question": ""
}
Historique : ${historyText}\nuser: ${message}`;

      // 3️⃣ Appel Gemini avec Gestion d'Erreur Robuste
      try {
        const geminiKey = await GEMINI_KEY.value();
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Nettoyage Markdown
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          // Si le JSON échoue, on encapsule le texte brut
          parsed = { 
            message: text, 
            criteria: { type: "", ville: "", budget: "", chambres: "", objectif: "" },
            next_question: "" 
          };
        }

        // 4️⃣ Sauvegarde Firestore
        const now = admin.firestore.FieldValue.serverTimestamp();
        const batch = db.batch();
        const msgCol = db.collection("conversations").doc(userId).collection("messages");
        
        batch.set(msgCol.doc(), { role: "user", text: message, timestamp: now });
        batch.set(msgCol.doc(), { role: "assistant", text: parsed.message, timestamp: now });
        await batch.commit();

        return res.status(200).json(parsed);

      } catch (geminiError) {
        console.error("ERREUR API GEMINI:", geminiError);
        // On renvoie un objet JSON propre même si l'API Gemini échoue
        return res.status(200).json({ 
          message: "Désolé, j'ai un petit souci technique avec mon cerveau IA. Réessaye dans une minute ! 🔌",
          criteria: { type: "", ville: "", budget: "", chambres: "", objectif: "" },
          next_question: ""
        });
      }

    } catch (error) {
      console.error("ERREUR GENERALE:", error);
      res.status(500).json({ error: "Erreur interne au serveur" });
    }
  }
);