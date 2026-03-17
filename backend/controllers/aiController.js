const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message vide" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Tu es l'assistant IA de Betna Immo, expert du marché immobilier en Côte d'Ivoire. 
    Réponds de manière professionnelle et concise à cette question : ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Erreur Chat:", error);
    res.status(500).json({ error: "L'IA est fatiguée, réessaie plus tard." });
  }
};

// ✅ LOGIQUE : Analyse d'annonce (JSON)
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
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
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
};