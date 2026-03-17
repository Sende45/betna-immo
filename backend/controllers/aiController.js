const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Vérification immédiate de la clé
    const key = process.env.GEMINI_KEY;
    if (!key || key === "") {
        return res.status(500).json({ 
          error: "CONFIG_ERROR", 
          details: "La clé GEMINI_KEY est vide ou introuvable sur Render." 
        });
    }

    // 2. Initialisation
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Appel à Google
    const result = await model.generateContent(message || "Salut");
    
    if (!result || !result.response) {
        throw new Error("Google Gemini a renvoyé une réponse vide.");
    }

    const responseText = result.response.text();
    res.json({ response: responseText });

  } catch (error) {
    console.error("❌ ERREUR CRITIQUE IA (Chat):", error);
    res.status(500).json({ 
      error: "SERVER_CRASH", 
      details: error.message,
      stack: error.stack 
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce (Nécessaire pour éviter le crash au démarrage)
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const key = process.env.GEMINI_KEY;
    
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tu es un expert immobilier. Analyse cette description et renvoie uniquement un JSON valide : 
    { "resume": "...", "points_forts": [], "type_bien": "..." } 
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("❌ ERREUR ANALYSE IA:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse", details: error.message });
  }
};