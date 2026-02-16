// src/components/SubscriptionButton.jsx
import { subscribe } from "../services/stripe";

export default function SubscriptionButton({ priceId }) {
  return (
    <button
      onClick={() => subscribe(priceId)}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-lg"
    >
      S'abonner maintenant
    </button>
  );
}