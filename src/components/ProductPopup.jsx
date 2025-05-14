import { useState } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import useCartStore from "../store/useCartStore";

export default function ProductPopup({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) return null;

  const { imageUrl, name, description, price } = product;

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full md:h-auto md:max-w-md bg-white rounded-t-2xl md:rounded-xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white md:text-gray-600 bg-blue-900 md:bg-transparent p-1 rounded-full"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold mb-4 text-center md:text-left">
          {name}
        </h2>

        {/* Imagen */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />

        {/* Precio y descripción */}
        <p className="text-lg font-semibold mb-1">${price.toLocaleString()}</p>
        <p className="text-sm text-gray-700 mb-4">{description}</p>

        {/* Selector de cantidad centrado */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={decrease}
            className="w-8 h-8 flex items-center justify-center border rounded-full text-lg"
          >
            <FaMinus />
          </button>
          <span className="text-lg font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={increase}
            className="w-8 h-8 flex items-center justify-center border rounded-full text-lg"
          >
            <FaPlus />
          </button>
        </div>

        {/* Botón agregar */}
        <button
          onClick={handleAdd}
          className="bg-[#002c66] text-white w-full py-2 rounded font-semibold hover:bg-[#001a4d] transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
