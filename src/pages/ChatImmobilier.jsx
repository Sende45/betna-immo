import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebase";
import { Send, Bot, User, Loader2 } from "lucide-react";

const db = getFirestore(app);

const ChatImmobilier = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 🔹 COPIE L'URL DE TA CONSOLE ICI
  const CHAT_ENDPOINT = "https://chatassistant-yvnfsqpgyq-uc.a.run.app"; 

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
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, message: userMessage })
      });

      if (!res.ok) throw new Error(`Erreur: ${res.status}`);

      const data = await res.json();
      let biens = [];

      // Recherche Firestore si des critères sont extraits par l'IA
      if (data.criteria && (data.criteria.ville || data.criteria.type)) {
        const q = query(
          collection(db, "properties"),
          ...(data.criteria.ville ? [where("ville", "==", data.criteria.ville)] : []),
          ...(data.criteria.type ? [where("type", "==", data.criteria.type)] : [])
        );
        const snapshot = await getDocs(q);
        biens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      setMessages([...newMessages, { role: "assistant", text: data.message, biens }]);
    } catch (err) {
      console.error("Erreur :", err);
      setMessages([...newMessages, { 
        role: "assistant", 
        text: "Désolé, je rencontre une difficulté technique. Vérifie la configuration CORS et l'URL v2." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <Bot size={24} />
        <h1 className="font-bold">Assistant Immobilier Betna</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] ${
              msg.role === "user" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white border shadow-sm rounded-tl-none text-gray-800"
            }`}>
              {msg.text}
            </div>
            
            {msg.biens?.length > 0 && (
              <div className="flex gap-3 overflow-x-auto py-2 mt-2 w-full">
                {msg.biens.map((bien, i) => (
                  <div key={i} className="min-w-[200px] bg-white border rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={bien.imageUrl} className="h-24 w-full object-cover" alt="bien" />
                    <div className="p-2 text-xs">
                      <div className="font-bold truncate">{bien.title}</div>
                      <div className="text-emerald-600 font-semibold">{bien.prix.toLocaleString()} FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium italic">
            <Loader2 className="animate-spin" size={18} /> L'IA analyse votre demande...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Où souhaitez-vous habiter ?"
        />
        <button onClick={sendMessage} className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition shadow-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatImmobilier;