const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/analyze', async (req, res) => {
  try {
    const { description } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tu es un expert immobilier. Analyse cette description et renvoie un JSON valide : 
    { "resume": "...", "points_forts": [], "type": "..." } 
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    res.status(500).json({ error: "Erreur IA" });
  }
});

module.exports = router;