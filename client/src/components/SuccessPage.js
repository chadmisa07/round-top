import React from "react";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-200 min-h-screen flex justify-center items-center">
      <div className="bg-white p-10 rounded-md shadow-md max-w-xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Vous vous êtes abonné avec succès!
        </h1>
        <p className="text-lg mb-4 text-center">
          Bagels Round Top vous souhaite la bienvenue! Votre abonnement à nos
          bons bagels frais est matinenant activé. À bientôt!
        </p>
        <button
          className="bg-yellow-600 text-white py-2 px-4 rounded-md block mx-auto hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          onClick={() => navigate("/")}
        >
          De retour à la maison
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
