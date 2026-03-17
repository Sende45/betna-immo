const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ LOGIQUE : Chat conversationnel
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const key = process.env.GEMINI_KEY;

    if (!key) {
      console.error("❌ GEMINI_KEY absente des variables d'environnement.");
      return res.status(500).json({ error: "Clé API manquante sur Render." });
    }

    const genAI = new GoogleGenerativeAI(key);

    // 🔄 CHANGEMENT MAJEUR : Passage sur 'gemini-pro' pour garantir la disponibilité
    // Ce modèle est le "vieux sage" qui ne renvoie jamais de 404.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Syntaxe directe et robuste
    const result = await model.generateContent(message || "Bonjour");
    const responseText = result.response.text();

    res.json({ response: responseText });

  } catch (error) {
    console.error("❌ ERREUR GEMINI:", error.message);
    
    res.status(500).json({ 
      error: "IA_ERROR", 
      details: error.message,
      suggestion: "Vérifiez les quotas dans Google AI Studio si gemini-pro échoue aussi."
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const key = process.env.GEMINI_KEY;
    if (!key) throw new Error("Clé API manquante");

    const genAI = new GoogleGenerativeAI(key);
    
    // On utilise également gemini-pro ici pour la cohérence et la stabilité
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro" 
      // Note: gemini-pro ne supporte pas toujours responseMimeType: "application/json" 
      // selon la version du SDK, donc on reste sur un appel simple.
    });

    const prompt = `Tu es un expert immobilier. Analyse cette description et renvoie UNIQUEMENT un JSON valide : 
    { "resume": "...", "points_forts": [], "type_bien": "..." } 
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Nettoyage au cas où l'IA ajoute des balises ```json
    const cleanJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("❌ ERREUR ANALYSE:", error.message);
    res.status(500).json({ error: "Erreur analyse", details: error.message });
  }
};