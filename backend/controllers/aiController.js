const axios = require('axios'); // On utilise axios (déjà dans tes dépendances)

// ✅ LOGIQUE : Chat conversationnel (Version REST)
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Clé API manquante sur Render." });
    }

    // URL officielle stable (v1) - Impossible d'avoir une 404 de version ici
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Tu es l'assistant IA de Betna Immo, expert immobilier en Côte d'Ivoire. Réponds de manière pro : ${message}` }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Extraction sécurisée de la réponse Google
    if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      const botReply = response.data.candidates[0].content.parts[0].text;
      return res.json({ response: botReply });
    } else {
      throw new Error("Format de réponse Google inattendu.");
    }

  } catch (error) {
    console.error("❌ ERREUR API REST GOOGLE:", error.response?.data || error.message);
    
    // On renvoie l'erreur réelle pour débugger
    res.status(500).json({ 
      error: "API_REST_ERROR", 
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce (Version REST)
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const apiKey = process.env.GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Analyse cette annonce et renvoie uniquement un JSON : { "resume": "...", "points_forts": [], "type_bien": "..." }. Texte : ${description}` }]
      }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    // Nettoyage au cas où l'IA met des balises ```json
    const cleanJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));

  } catch (error) {
    res.status(500).json({ error: "Erreur analyse", details: error.message });
  }
};