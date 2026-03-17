const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatImmobilier = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Vérification immédiate de la clé
    const key = process.env.GEMINI_KEY;
    if (!key || key === "") {
        return res.status(500).json({ error: "CONFIG_ERROR", details: "La clé GEMINI_KEY est vide ou introuvable sur Render." });
    }

    // 2. Initialisation
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Appel à Google avec un timeout manuel
    const result = await model.generateContent(message || "Salut");
    
    if (!result || !result.response) {
        throw new Error("Google Gemini a renvoyé une réponse vide.");
    }

    const responseText = result.response.text();
    res.json({ response: responseText });

  } catch (error) {
    // 🔥 C'EST ICI QUE TOUT SE JOUE
    console.error("❌ ERREUR CRITIQUE IA:", error);

    res.status(500).json({ 
      error: "SERVER_CRASH", 
      details: error.message,
      stack: error.stack // On veut voir la ligne exacte qui plante
    });
  }
};