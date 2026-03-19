const axios = require('axios');

// ✅ LOGIQUE : Chat conversationnel (Version Gemini 3 Flash)
exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Clé API manquante sur Render." });
    }

    // 🚀 MISE À JOUR : On cible le modèle Gemini 3 Flash
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Tu es l'assistant expert de Betna Immo en Côte d'Ivoire. Réponds de façon concise et pro : ${message}` }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Extraction de la réponse
    if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      const botReply = response.data.candidates[0].content.parts[0].text;
      return res.json({ response: botReply });
    } else {
      throw new Error("Format de réponse Gemini 3 inattendu.");
    }

  } catch (error) {
    console.error("❌ ERREUR GEMINI 3:", error.response?.data || error.message);
    
    // On renvoie l'erreur détaillée pour voir si c'est encore une 404
    res.status(500).json({ 
      error: "GEMINI_3_ERROR", 
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const apiKey = process.env.GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Analyse cette annonce et renvoie uniquement un JSON valide : { "resume": "...", "points_forts": [], "type_bien": "..." }. Texte : ${description}` }]
      }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    res.status(500).json({ error: "Erreur analyse", details: error.message });
  }
};