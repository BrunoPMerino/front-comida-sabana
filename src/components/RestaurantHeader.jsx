import { AiOutlineStar } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";

export default function RestaurantHeader({ name, rating, deliveryTime }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{deliveryTime} min</p>
      </div>
      <div className="flex items-center gap-1">
        <AiOutlineStar className="text-yellow-500" />
        <span className="text-sm font-semibold">{rating}</span>
        <FaChevronRight className="ml-2 text-gray-500" />
      </div>
    </div>
  );
}