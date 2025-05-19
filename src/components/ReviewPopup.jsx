import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewPopup({ onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ rating, comment });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center md:justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full md:w-[600px] rounded-t-2xl md:rounded-xl p-6 md:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute -top-5 right-4 text-white text-sm pointer-events-none select-none">
          Omitir
        </span>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cuéntanos tu experiencia...</h2>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              onClick={() => setRating(i + 1)}
              className={`w-8 h-8 cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-32 p-3 border rounded resize-none text-sm placeholder-gray-500"
          placeholder="Escribe aquí tu reseña"
        ></textarea>

        <p className="text-xs text-gray-500 mt-2 mb-4">
          * Tu reseña será pública para los usuarios de nuestra app.
        </p>

        <button
          onClick={handleSubmit}
          className="bg-[#002c66] text-white w-full py-2 rounded font-semibold hover:bg-[#001a4d] transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}