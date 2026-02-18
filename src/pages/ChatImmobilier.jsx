import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Send, Bot, Loader2 } from "lucide-react";

const ChatImmobilier = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input;

    // Ajouter le message utilisateur à l'écran
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 🔥 Appel vers ta fonction Vercel
      const res = await fetch("/api/chatAssistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);

      const data = await res.json();

      // Ajouter la réponse IA
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err) {
      console.error("Erreur :", err);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: "Une erreur est survenue. Vérifie que l'API est bien déployée.",
        },
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none"
                  : "bg-white border shadow-sm rounded-tl-none text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium italic">
            <Loader2 className="animate-spin" size={18} />
            L'IA analyse votre demande...
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Où souhaitez-vous habiter ?"
        />

        <button
          onClick={sendMessage}
          className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition shadow-lg"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatImmobilier;
