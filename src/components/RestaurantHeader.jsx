import { FaStar, FaChevronRight, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RestaurantHeader({ name, rating, deliveryTime, restaurantId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div
      className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between mb-2 px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition"
      onClick={handleClick}
      aria-label={`Restaurante ${name}, calificación ${rating}, entrega estimada en ${deliveryTime} minutos`}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold">{name}</h2>
          <FaStar className="text-yellow-400 w-4 h-4" />
          <span className="text-sm font-semibold">
            {rating?.toFixed(1) || "0.0"}
          </span>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaRegClock className="w-4 h-4" />
          {deliveryTime ? `${deliveryTime} min` : "Sin tiempo estimado"}
        </p>
      </div>
      <FaChevronRight className="text-gray-500 w-4 h-4" />
    </div>
  );
}