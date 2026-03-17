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
    
    // MODIF : On utilise l'identifiant de version complet pour éviter la 404
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // 3. Appel à Google (Syntaxe robuste)
    const result = await model.generateContent(message || "Salut");
    
    // Récupération sécurisée du texte
    const response = result.response;
    const responseText = response.text();
    
    if (!responseText) {
        throw new Error("Google Gemini a renvoyé une réponse vide.");
    }

    res.json({ response: responseText });

  } catch (error) {
    console.error("❌ ERREUR CRITIQUE IA (Chat):", error.message);
    
    // Si la 404 persiste, on renvoie une suggestion
    res.status(500).json({ 
      error: "SERVER_CRASH", 
      details: error.message,
      suggestion: "Si l'erreur est toujours 404, essayez 'gemini-pro' comme nom de modèle."
    });
  }
};

// ✅ LOGIQUE : Analyse d'annonce
exports.analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const key = process.env.GEMINI_KEY;
    
    const genAI = new GoogleGenerativeAI(key);
    // On applique la même correction de nom ici
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-001",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Tu es un expert immobilier. Analyse cette description et renvoie uniquement un JSON valide : 
    { "resume": "...", "points_forts": [], "type_bien": "..." } 
    Texte : ${description}`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("❌ ERREUR ANALYSE IA:", error.message);
    res.status(500).json({ error: "Erreur lors de l'analyse", details: error.message });
  }
};