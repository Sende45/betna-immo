// src/components/SubscriptionButton.jsx
import { subscribe } from "../services/stripe";
import { Zap } from 'lucide-react'; // Icône pour dynamiser le bouton

export default function SubscriptionButton({ priceId }) {
  return (
    <button
      onClick={() => subscribe(priceId)}
      className="group relative w-full flex items-center justify-center gap-3 py-4 px-4 border border-transparent text-lg font-bold rounded-full text-white bg-gray-950 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-emerald-200 hover:scale-[1.02]"
    >
      <Zap className="h-5 w-5 text-emerald-400 group-hover:text-white" />
      S'abonner maintenant
    </button>
  );
}