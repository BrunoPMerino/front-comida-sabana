import { FaStar, FaChevronRight, FaRegClock } from "react-icons/fa";

export default function RestaurantHeader({ name, rating, deliveryTime }) {
  return (
    <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between mb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold">{name}</h2>
          <FaStar className="text-yellow-400 w-4 h-4" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaRegClock className="w-4 h-4" />
          {deliveryTime} min
        </p>
      </div>
      <FaChevronRight className="text-gray-500" />
    </div>
  );
}