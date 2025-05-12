import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { FaUser } from "react-icons/fa";

export default function UserInfoPopup() {
  const { user, logout } = useUserStore();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // <-- hook para redirigir

  if (!user) return null;

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-white rounded-full p-2 shadow-md border"
      >
        <FaUser className="text-[#002c66] text-xl" />
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-sm rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Información del usuario</h2>
            <p className="text-md font-bold mb-1">{user.name} {user.lastName}</p>
            <p className="text-sm text-gray-700 mb-4">{user.email}</p>
            <button
              onClick={() => {
                logout();
                setShowPopup(false);
                navigate("/login"); // <-- redirige a login
              }}
              className="bg-red-600 text-white w-full py-2 rounded font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}