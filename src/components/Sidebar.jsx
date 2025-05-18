import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

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

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  };

  if (!user) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <div
        className={`absolute top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[300px] max-w-full pointer-events-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h1 className="text-lg font-bold text-[#002c66]">Comida Sabana</h1>
        </div>

        <div className="px-4 py-2">
          {/* Sección Restaurantes */}
          <div className={`border-t ${!expanded ? "border-b" : ""} py-2 my-4`}>
            <h2
              className="font-bold text-md mb-2 cursor-pointer px-2"
              onClick={() => setExpanded(!expanded)}
            >
              Restaurantes <span className="ml-2">{expanded ? "▲" : "▼"}</span>
            </h2>

            {expanded && (
              <ul>
                {restaurants.map((rest, index) => {
                  const isActive =
                    location.pathname === `/restaurant/${rest._id}`;
                  const isFirst = index === 0;
                  const isLast = index === restaurants.length - 1;

                  return (
                    <li
                      key={rest._id}
                      className={`relative text-black px-4 py-2 cursor-pointer ${
                        isActive
                          ? "bg-blue-100 font-bold text-[#002c66]"
                          : "hover:underline"
                      }`}
                      onClick={() => {
                        navigate(`/restaurant/${rest._id}`);
                        onClose();
                      }}
                    >
                      {/* Línea superior corta (excepto en el primero) */}
                      {!isFirst && (
                        <div className="absolute top-0 left-4 w-[85%] h-px bg-black"></div>
                      )}

                      {/* Contenido */}
                      {rest.name}

                      {/* Línea inferior solo en el último restaurante */}
                      {isLast && (
                        <div className="absolute bottom-0 left-4 w-[85%] h-px bg-black"></div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Mapa y Pedidos */}
          <div className="border-t border-b py-2 my-4">
            <button
              onClick={() => {
                navigate("/map");
                onClose();
              }}
              className={`w-full text-left font-semibold px-2 py-2 cursor-pointer ${
                location.pathname === "/map"
                  ? "bg-blue-100 text-[#002c66] font-bold"
                  : "text-black hover:underline"
              }`}
            >
              Mapa
            </button>

            <div className="border-t my-2" />

            <button
              onClick={() => {
                navigate("/history");
                onClose();
              }}
              className={`w-full text-left font-semibold px-2 py-2 cursor-pointer ${
                location.pathname === "/history"
                  ? "bg-blue-100 text-[#002c66] font-bold"
                  : "text-black hover:underline"
              }`}
            >
              Pedidos
            </button>
          </div>

          {/* Usuario y cerrar sesión */}
          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium">Usuario</p>
            <p className="text-sm">
              {user.name} {user.lastName}
            </p>
            <p className="text-xs text-gray-600 mb-4">{user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
