import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Send, Bot, Loader2 } from "lucide-react";

const ChatImmobilier = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // URL de ta fonction Firebase (copiée depuis ta console Firebase)
  const FIREBASE_FUNCTION_URL = "https://chatassistant-yvnpsmqvga-uc.a.run.app"; 

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input;
    const newMessages = [...messages, { role: "user", text: userMessage }];
    
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(FIREBASE_FUNCTION_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            userId: user.uid, // Nécessaire pour l'historique Firestore
            message: userMessage 
        }),
      });

      if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
      
      const data = await res.json();

      // On récupère data.message car ton backend index.js renvoie { message, criteria, ... }
      const botReply = data.message || "Désolé, je n'ai pas pu générer de réponse.";

      setMessages([...newMessages, { role: "assistant", text: botReply }]);
    } catch (err) {
      console.error("Erreur Chat:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Oups ! Connexion perdue avec l'assistant. Réessaie ?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <Bot size={24} />
        <h1 className="font-bold">Assistant Immobilier Betna</h1>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <Bot size={48} className="mx-auto mb-2 opacity-20" />
            <p>Posez-moi vos questions sur l'immobilier en Côte d'Ivoire !</p>
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
                  : "bg-white border text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicateur de chargement dynamique */}
        {loading && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium italic animate-pulse">
            <Loader2 className="animate-spin" size={18} />
            Betna IA réfléchit...
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ex: Je cherche un 3 pièces à Cocody..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={`p-3 rounded-xl transition shadow-lg ${
            loading || !input.trim() 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatImmobilier;