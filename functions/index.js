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
      // 💡 CORRECTION : Récupération robuste de la clé (Local vs Cloud)
      const geminiKey = process.env.GEMINI_KEY || await GEMINI_KEY.value();
      const genAI = new GoogleGenerativeAI(geminiKey);
      
      // 💡 CORRECTION : Nom du modèle (sans le préfixe models/)
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
      
      // Nettoyage robuste
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text;

      res.status(200).json(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Erreur Gemini (Analyze):", error);
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
    // Gestion manuelle du CORS pour éviter les erreurs Localhost
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }

    try {
      const { userId, message } = req.body;
      if (!userId || !message) {
        return res.status(400).json({ message: "Données manquantes" });
      }

      const db = admin.firestore();
      
      // 1️⃣ Récupération de l'historique
      const snapshot = await db.collection("conversations").doc(userId).collection("messages")
        .orderBy("timestamp", "desc").limit(10).get();
      
      const history = [];
      snapshot.forEach(doc => history.unshift(doc.data()));

      // 2️⃣ Construction du prompt
      let historyText = history.map(m => `${m.role}: ${m.text}`).join("\n");
      const prompt = `
Tu es un conseiller immobilier expert en Côte d'Ivoire 😎🏡.
Ton but est d'aider le client à trouver son logement idéal.
Tu dois :
- Lui répondre poliment et de façon ludique
- Lui demander son budget
- Demander le nombre de pièces (chambres)
- Savoir s'il veut un appartement ou une maison
- Proposer des quartiers adaptés (Cocody, Marcory, Bingerville, etc.)

Réponds UNIQUEMENT en JSON sous ce format :
{
  "message": "ta réponse ludique ici avec tes questions",
  "criteria": { "type": "", "ville": "", "budget": "", "chambres": "", "objectif": "" },
  "next_question": "la question suivante la plus pertinente"
}

Historique récent :
${historyText}
user: ${message}`;

      // 3️⃣ Appel Gemini
      try {
        // 💡 CORRECTION : Récupération robuste de la clé
        const geminiKey = process.env.GEMINI_KEY || await GEMINI_KEY.value();
        const genAI = new GoogleGenerativeAI(geminiKey);
        
        // 💡 CORRECTION : Utilisation du nom de modèle stable
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Nettoyage JSON strict
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let parsed;
        
        try {
          parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (e) {
          parsed = { 
            message: text, 
            criteria: { type: "", ville: "", budget: "", chambres: "", objectif: "" },
            next_question: "" 
          };
        }

        // 4️⃣ Sauvegarde Firestore
        const now = admin.firestore.FieldValue.serverTimestamp();
        const msgCol = db.collection("conversations").doc(userId).collection("messages");
        
        await Promise.all([
          msgCol.add({ role: "user", text: message, timestamp: now }),
          msgCol.add({ role: "assistant", text: parsed.message, timestamp: now })
        ]);

        return res.status(200).json(parsed);

      } catch (geminiError) {
        console.error("ERREUR API GEMINI:", geminiError);
        return res.status(200).json({ 
          message: "Désolé, j'ai eu un petit souci technique avec mon API. Peux-tu reformuler ? 🔌",
          criteria: {},
          next_question: ""
        });
      }

    } catch (error) {
      console.error("ERREUR SERVEUR:", error);
      res.status(500).json({ message: "Erreur interne au serveur" });
    }
  }
);