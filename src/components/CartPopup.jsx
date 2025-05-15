import { FaTimes } from "react-icons/fa";
import useCartStore from "../store/useCartStore";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import SuccessPopup from "./SuccessPopup";

const API_URL = import.meta.env.VITE_API_URL;

export default function CartPopup({ onClose }) {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCartStore();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item._id);
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handleIncrease = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/orders/client`,
        {
          restaurantId: cartItems[0].restaurantId,
          reservationDate: "2026-05-03T14:30:00Z",
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        },
        { withCredentials: true }
      );

      console.log("Pedido realizado:", response.data);
      clearCart();
      setShowSuccessPopup(true);
      setCountdown(3);
    } catch (error) {
      console.error("Error al finalizar el pedido:", error.response?.data || error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full md:h-auto md:max-w-xl bg-white rounded-t-2xl md:rounded-xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white md:text-gray-600 bg-blue-900 md:bg-transparent p-1 rounded-full"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
                onRemove={() => removeFromCart(item._id)}
              />
            ))}

            <CartSummary subtotal={subtotal} onSubmit={handleSubmitOrder} />
          </div>
        )}

        {showSuccessPopup && (
          <SuccessPopup
            countdown={countdown}
            setCountdown={setCountdown}
            onClose={() => {
              setShowSuccessPopup(false);
              onClose();
              navigate("/history");
            }}
          />
        )}
      </div>
    </div>
  );
}
