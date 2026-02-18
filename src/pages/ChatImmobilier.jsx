import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebase"; // Assure-toi d'avoir ton init Firebase ici

const db = getFirestore(app);

const ChatImmobilier = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Remplace cette URL par l'URL exacte de ta fonction chatAssistant déployée
  const CHAT_ENDPOINT = "https://us-central1-betna-immo-app.cloudfunctions.net/chatAssistant";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, message: input })
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();

      let biens = [];
      if (data.criteria) {
        // 🔹 Recherche les biens correspondant aux critères
        const q = query(
          collection(db, "properties"),
          ...(data.criteria.ville ? [where("ville", "==", data.criteria.ville)] : []),
          ...(data.criteria.type ? [where("type", "==", data.criteria.type)] : [])
        );

        const snapshot = await getDocs(q);
        biens = snapshot.docs.map(doc => doc.data());
      }

      setMessages([
        ...newMessages,
        { role: "assistant", text: data.message, biens }
      ]);
      setInput("");
    } catch (err) {
      console.error("Erreur chatAssistant :", err);
      setMessages([...newMessages, { role: "assistant", text: "Erreur IA 😓 Vérifie que la fonction chatAssistant est déployée et que la clé GEMINI_KEY est configurée.", biens: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto border p-2 rounded mb-2 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <div className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-green-100 self-start"}`}>
              {msg.text}
            </div>
            {msg.role === "assistant" && msg.biens && msg.biens.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {msg.biens.map((bien, i) => (
                  <div key={i} className="border rounded p-2 flex flex-col">
                    {bien.imageUrl && <img src={bien.imageUrl} alt={bien.title} className="h-32 w-full object-cover rounded mb-2" />}
                    <div className="font-semibold">{bien.title}</div>
                    <div>{bien.type} - {bien.chambres} chambres</div>
                    <div>{bien.ville} - {bien.prix.toLocaleString()} FCFA</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-500">L’IA réfléchit... 🤔</div>}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded p-2 mr-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Posez votre question sur un bien immobilier..."
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={sendMessage}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatImmobilier;
