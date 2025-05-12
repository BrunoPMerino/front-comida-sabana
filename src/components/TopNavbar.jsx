import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import useUserStore from "../store/useUserStore";

export default function TopNavbar() {
  const { user, logout } = useUserStore();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo + título visibles SIEMPRE */}
        <div className="flex items-center gap-2">
          <img src="/Unisabana-logo.png" alt="Logo" className="h-6 md:h-8" />
          <span className="font-bold text-[#002c66] text-sm md:text-lg">Comida Sabana</span>
        </div>

        {/* Íconos */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="block md:hidden" onClick={togglePopup}>
            <FaUser className="text-xl text-[#002c66]" />
          </div>
          <div className="hidden md:block">
            <Link to="/menu">
              <FaShoppingCart className="text-xl text-[#002c66]" />
            </Link>
          </div>
        </div>
      </div>

      {showPopup && (
        <>
          <div className="fixed inset-0 bg-black opacity-60 z-40"></div>

          <div
            ref={popupRef}
            className="fixed top-20 left-4 right-4 mx-auto bg-white p-4 rounded-md shadow-lg z-50 md:hidden"
          >
            <h2 className="font-bold text-lg mb-2">Información del usuario</h2>
            <p className="text-md font-medium">{user?.name} {user?.lastName}</p>
            <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
            <button
              onClick={logout}
              className="bg-red-600 text-white font-semibold w-full py-2 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </header>
  );
}