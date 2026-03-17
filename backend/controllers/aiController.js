const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message vide" });

    // Initialisation ICI pour garantir la lecture de la variable d'env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Tu es l'assistant IA de Betna Immo, expert du marché immobilier en Côte d'Ivoire. 
    Réponds de manière professionnelle et concise à cette question : ${message}`;

    const result = await model.generateContent(prompt);
    
    // On renvoie "response" pour matcher avec ton composant React
    res.json({ response: result.response.text() });

  } catch (error) {
    console.error("❌ Erreur détaillée Gemini:", error);
    res.status(500).json({ 
      error: "L'IA est indisponible", 
      details: error.message // Ça nous aidera à voir si c'est un problème de quota ou de clé
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce (JSON)
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Analyse cette annonce immobilière et renvoie uniquement un JSON :
    { "resume": "...", "points_forts": [], "type_bien": "..." }
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("❌ Erreur Analyse IA:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
};