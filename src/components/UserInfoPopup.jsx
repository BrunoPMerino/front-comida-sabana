import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import axios from "axios";

export default function UserInfoPopup({ showPopup, setShowPopup }) {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowPopup]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      logout();
      setShowPopup(false);
      navigate("/");
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  };

  if (!user || !showPopup) return null;

  return (
    <>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/50 z-40"></div>

      {/* Popup visible en todas las pantallas */}
      <div
        ref={popupRef}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white p-6 rounded-md shadow-xl z-50"
      >
        <h2 className="font-bold text-lg mb-2">Información del usuario</h2>
        <p className="text-md font-medium">
          {user.name} {user.lastName || ""}
        </p>
        <p className="text-sm text-gray-600 mb-4">{user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white font-semibold w-full py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}