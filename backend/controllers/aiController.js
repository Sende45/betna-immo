const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const key = process.env.GEMINI_KEY;

    if (!key || key === "") {
      return res.status(500).json({ 
        error: "CONFIG_ERROR", 
        details: "La clé GEMINI_KEY est vide ou introuvable sur Render." 
      });
    }

    // 1. Initialisation
    const genAI = new GoogleGenerativeAI(key);

    // 🛠️ MODIF ULTIME : On force le modèle ET l'API Version 1 (Stable)
    // On retire le "-latest" qui semble poser problème sur v1beta
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1' } 
    );

    // 2. Appel à Google
    const result = await model.generateContent(message || "Salut");
    
    if (!result || !result.response) {
      throw new Error("Google Gemini a renvoyé une réponse vide.");
    }

    const responseText = result.response.text();
    res.json({ response: responseText });

  } catch (error) {
    console.error("❌ ERREUR CRITIQUE IA (Chat):", error.message);
    res.status(500).json({ 
      error: "IA_ERROR", 
      details: error.message,
      note: "Le serveur a forcé l'API v1. Si l'erreur persiste, vérifiez la région de votre serveur Render."
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const key = process.env.GEMINI_KEY;
    const genAI = new GoogleGenerativeAI(key);
    
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1' }
    );

    const prompt = `Tu es un expert immobilier. Analyse cette description et renvoie uniquement un JSON valide : 
    { "resume": "...", "points_forts": [], "type_bien": "..." } 
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("❌ ERREUR ANALYSE IA:", error.message);
    res.status(500).json({ error: "Erreur lors de l'analyse", details: error.message });
  }
};