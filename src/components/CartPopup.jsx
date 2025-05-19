import { FaTimes } from "react-icons/fa";
import useCartStore from "../store/useCartStore";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import SuccessPopup from "./SuccessPopup";
import useUserStore from "../store/useUserStore";

const API_URL = import.meta.env.VITE_API_URL;

export default function CartPopup({ onClose }) {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [customerName, setCustomerName] = useState("");
  const [customReservation, setCustomReservation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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

  const getDefaultReservation = () => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 10);
    return now.toISOString();
  };

  const handleSubmitOrder = async () => {
    setErrorMsg("");
    if (cartItems.length === 0) return;

    try {
      await axios.post(
        `${API_URL}/api/orders/client`,
        {
          restaurantId: cartItems[0].restaurantId,
          reservationDate: customReservation || getDefaultReservation(),
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        },
        { withCredentials: true }
      );

      clearCart();
      setShowSuccessPopup(true);
      setCountdown(3);
    } catch (error) {
      console.error("Error al finalizar el pedido:", error.response?.data || error.message);
      setErrorMsg("No se pudo realizar el pedido. Inténtalo nuevamente.");
    }
  };

  const handlePOSOrder = async () => {
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Debes ingresar el nombre del cliente.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/orders/pos`,
        {
          name: customerName,
          restaurantId: cartItems[0].restaurantId,
          reservationDate: getDefaultReservation(),
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        },
        { withCredentials: true }
      );

      clearCart();
      setCustomerName("");
      setShowSuccessPopup(true);
      setCountdown(3);
    } catch (error) {
      console.error("Error creando pedido POS:", error.response?.data || error.message);
      setErrorMsg("No se pudo crear el pedido POS.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/50">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative z-10 w-full max-h-[85vh] sm:max-w-sm md:max-w-xl md:h-auto bg-white rounded-t-2xl md:rounded-xl p-6 overflow-y-auto mx-auto mt-6 sm:mt-0"
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

            {/* Campo POS: nombre del cliente */}
            {user?.role === "pos" && (
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-2"
              />
            )}

            {/* Campo Cliente: fecha/hora de reserva */}
            {user?.role === "client" && (
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Selecciona la hora de entrega:
                </label>
                <input
                  type="datetime-local"
                  value={customReservation}
                  onChange={(e) => setCustomReservation(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-red-600 text-sm font-medium mb-2">{errorMsg}</p>
            )}

            <CartSummary
              subtotal={subtotal}
              onSubmit={user?.role === "pos" ? handlePOSOrder : handleSubmitOrder}
              submitLabel={user?.role === "pos" ? "Crear pedido POS" : "Finalizar pedido"}
            />
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
