import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import useUserStore from "../store/useUserStore";
import CartPopup from "./CartPopup";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useUserStore();
  const [showCart, setShowCart] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/restaurants`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error al obtener restaurantes:", error);
      }
    };
    fetchRestaurants();
  }, []);

  if (!user) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      ></div>
      <div
        className={`absolute top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} w-[300px] max-w-full pointer-events-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h1 className="text-lg font-bold text-[#002c66]">Comida Sabana</h1>
        </div>

        <div className="px-4 py-2">
          <h2
            className="font-bold text-md mb-2 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            Restaurantes <span className="ml-2">{expanded ? "▲" : "▼"}</span>
          </h2>
          {expanded && (
            <ul className="pl-4 mb-4">
              {restaurants.map((rest) => (
                <li key={rest._id} className="mb-1 list-disc">
                  {rest.name}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => {
              navigate("/map");
              onClose();
            }}
            className="w-full text-left mb-4 text-[#002c66] font-semibold hover:underline"
          >
            Mapa
          </button>

          <button
            onClick={() => {
              navigate("/history");
              onClose();
            }}
            className="w-full text-left mb-4 text-[#002c66] font-semibold hover:underline"
          >
            Pedidos
          </button>

          <button
            onClick={() => setShowCart(true)}
            className="w-full text-left mb-4 text-[#002c66] font-semibold hover:underline"
          >
            Carrito
          </button>

          <div className="mt-6">
            <p className="text-sm font-medium">Usuario</p>
            <p className="text-sm">{user.name} {user.lastName}</p>
            <p className="text-xs text-gray-600 mb-4">{user.email}</p>

            <button
              onClick={() => {
                logout();
                navigate("/login");
                onClose();
              }}
              className="w-full bg-red-600 text-white font-semibold py-2 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {showCart && <CartPopup onClose={() => setShowCart(false)} />}
      </div>
    </div>
  );
}

