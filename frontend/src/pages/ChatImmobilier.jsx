import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Send, Bot, Loader2, Trash2, RefreshCcw } from "lucide-react"; 
import api from "../api/axios"; // ✅ Utilisation de ton instance Axios avec intercepteur

const ChatImmobilier = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- EFFET : Scroll automatique vers le bas ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // --- ACTION : Nettoyer l'historique ---
  const clearHistory = () => {
    if (window.confirm("Voulez-vous supprimer toute la conversation ?")) {
      setMessages([]);
    }
  };

  // --- ACTION : Envoyer un message ---
  const sendMessage = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage = input;
    // Mise à jour optimiste de l'UI
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // ✅ APPEL API : Vers ton serveur Node.js (via l'intercepteur Axios)
      // La route attendue est /ai/chat sur ton backend Render
      const res = await api.post("/ai/chat", { 
        userId: user.id || user._id, // Sécurité pour MongoDB
        message: userMessage 
      });

      // ✅ MODIF : Récupération de la réponse via 'response' (mapping backend)
      const botReply = res.data.response || "Désolé, je n'ai pas pu générer de réponse.";
      setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);

    } catch (err) {
      console.error("Erreur Chat IA:", err);
      
      // Extraction du message d'erreur détaillé (pour débugger le 404/500)
      const errorMsg = err.response?.data?.details || 
                       err.response?.data?.error || 
                       "Oups ! Connexion perdue avec Betna. Réessaie ? 🔌";
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
      {/* Header avec bouton Nettoyer */}
      <div className="bg-emerald-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Bot size={24} />
          <div>
            <h1 className="font-bold text-lg">Assistant Immobilier Betna</h1>
            <p className="text-xs text-emerald-100 italic">Expert Côte d'Ivoire 😎🏡</p>
          </div>
        </div>
        
        {/* ✅ Bouton Nettoyer l'historique - Visible uniquement s'il y a des messages */}
        {messages.length > 0 && (
          <button 
            onClick={clearHistory}
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium bg-emerald-500/20 shadow-inner"
            title="Effacer la conversation"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        )}
      </div>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <Bot size={48} className="mx-auto mb-2 opacity-20" />
            <p className="font-medium text-slate-500">
              Bonjour {user?.fullName?.split(' ')[0]} ! <br /> 
              Je suis l'expert Betna. Où souhaitez-vous habiter ?
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* ✅ Feedback visuel pendant le chargement */}
        {loading && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium italic animate-pulse p-2">
            <RefreshCcw className="animate-spin" size={16} />
            <span className="text-sm">Betna analyse votre recherche...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Barre d'input */}
      <div className="p-4 border-t bg-white flex gap-2 items-center">
        <input
          className="flex-1 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm bg-gray-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Posez votre question à l'expert..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={`p-3 rounded-xl transition-all shadow-lg ${
            loading || !input.trim() 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-emerald-200"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatImmobilier;