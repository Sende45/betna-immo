const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const key = process.env.GEMINI_KEY;

    if (!key) return res.status(500).json({ error: "Clé API manquante sur Render." });

    const genAI = new GoogleGenerativeAI(key);

    // 🔄 CHANGEMENT ICI : On utilise "gemini-1.5-flash" sans suffixe 
    // OU "gemini-pro" si le premier continue de bloquer.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // On utilise la syntaxe la plus simple possible
    const result = await model.generateContent(message || "Bonjour");
    const responseText = result.response.text();

    res.json({ response: responseText });

  } catch (error) {
    console.error("❌ ERREUR GEMINI:", error.message);
    
    // Si c'est encore une 404, on tente un "fallback" automatique vers gemini-pro
    res.status(500).json({ 
      error: "IA_ERROR", 
      details: error.message,
      suggestion: "Essayez de remplacer 'gemini-1.5-flash' par 'gemini-pro' dans le contrôleur."
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const key = process.env.GEMINI_KEY;
    const genAI = new GoogleGenerativeAI(key);
    
    // Même changement ici pour la stabilité
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
    res.status(500).json({ error: "Erreur analyse", details: error.message });
  }
};