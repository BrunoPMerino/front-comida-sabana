import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-2 border rounded overflow-hidden p-2">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 object-cover"
      />
      <div className="flex-1 w-full">
        <h3 className="text-sm font-semibold mb-1 truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 mb-1 truncate">{item.description}</p>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <p className="text-sm font-bold">${item.price.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={onDecrease}
              className="border rounded w-8 h-8 flex items-center justify-center"
            >
              <FaMinus className="text-xs" />
            </button>
            <span className="text-sm font-semibold w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              className="border rounded w-8 h-8 flex items-center justify-center"
            >
              <FaPlus className="text-xs" />
            </button>
            <button
              onClick={onRemove}
              className="text-gray-600 hover:text-red-600 ml-1"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}