const axios = require('axios');

exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_KEY;

    if (!apiKey) return res.status(500).json({ error: "Clé API absente sur Render." });

    // 🔄 ON CHANGE LE MODÈLE POUR 'gemini-1.5-pro' 
    // car 'flash' semble être désactivé sur ton projet Google Cloud
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Tu es l'assistant de Betna Immo. Réponds courtement : ${message}` }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      return res.json({ response: response.data.candidates[0].content.parts[0].text });
    } else {
      throw new Error("Réponse Google vide");
    }

  } catch (error) {
    console.error("❌ ERREUR FATALE GOOGLE:", error.response?.data || error.message);
    
    // Si ça renvoie encore 404, on affiche l'erreur complète de Google
    res.status(500).json({ 
      error: "COMPTE_GOOGLE_NON_ACTIVE", 
      details: error.response?.data?.error?.message || error.message,
      suggestion: "Connecte-toi sur https://aistudio.google.com/ et vérifie que tu peux chatter avec Gemini 1.5 Pro."
    });
  }
};

// Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const apiKey = process.env.GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Analyse et renvoie JSON : { "resume": "..." }. Texte : ${description}` }]
      }]
    });

    res.json(JSON.parse(response.data.candidates[0].content.parts[0].text));
  } catch (error) {
    res.status(500).json({ error: "Erreur analyse", details: error.message });
  }
};