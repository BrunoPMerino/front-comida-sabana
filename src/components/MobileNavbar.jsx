import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import ReviewPopup from "./ReviewPopup";
import CartPopup from "./CartPopup";
import useUserStore from "../store/useUserStore";

export default function MobileNavbar({ isDisabled = false }) {
  const { pathname } = useLocation();
  const { user } = useUserStore();
  const isPOS = user?.role === "pos";

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeStyle = "text-yellow-300";

  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-[#00296B] text-white flex justify-around items-center h-14 md:hidden z-40 shadow-inner transition-opacity duration-300 ${
          isDisabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Link to="/home" aria-label="Home">
          <FaHome className={`w-6 h-6 ${pathname === "/home" ? activeStyle : ""}`} />
        </Link>

        {isPOS ? (
          <>
            <Link to="/history" aria-label="Pedidos">
              <HiOutlineClipboardList
                className={`w-6 h-6 ${pathname === "/history" ? activeStyle : ""}`}
              />
            </Link>
            <button onClick={() => setShowPopup(true)} aria-label="Carrito">
              <FaShoppingCart
                className={`w-6 h-6 ${showPopup ? activeStyle : ""}`}
              />
            </button>
            <Link to="/inventory" aria-label="Inventario">
              <BsBoxSeam
                className={`w-6 h-6 ${pathname === "/inventory" ? activeStyle : ""}`}
              />
            </Link>
          </>
        ) : (
          <>
            <Link to="/map" aria-label="Mapa">
              <FaMapMarkerAlt
                className={`w-6 h-6 ${pathname === "/map" ? activeStyle : ""}`}
              />
            </Link>
            <Link to="/history" aria-label="Historial">
              <HiOutlineClipboardList
                className={`w-6 h-6 ${pathname === "/history" ? activeStyle : ""}`}
              />
            </Link>
            <button onClick={() => setShowPopup(true)} aria-label="Carrito">
              <FaShoppingCart
                className={`w-6 h-6 ${showPopup ? activeStyle : ""}`}
              />
            </button>
          </>
        )}
      </nav>

      {showPopup && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-end md:items-center justify-center">
          <div
            ref={popupRef}
            className="w-full md:w-[600px] bg-white rounded-t-2xl md:rounded-xl p-6"
          >
            <CartPopup onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
    </>
  );
}