import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaListAlt,
  FaShoppingCart,
} from "react-icons/fa";
import ReviewPopup from "./ReviewPopup";

export default function MobileNavbar({ isDisabled = false }) {
  const { pathname } = useLocation();
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

  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-[#00296B] text-white flex justify-around items-center h-14 md:hidden z-40 shadow-inner transition-opacity duration-300 ${
          isDisabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Link to="/home" aria-label="Home">
          <FaHome className="w-6 h-6" />
        </Link>
        <Link to="/menu" aria-label="Menu">
          <FaMapMarkerAlt className="w-6 h-6" />
        </Link>
        <Link to="/reviews" aria-label="Login">
          <FaListAlt className="w-6 h-6" />
        </Link>
        <button onClick={() => setShowPopup(true)} aria-label="Register">
          <FaShoppingCart className="w-6 h-6" />
        </button>
      </nav>
      {showPopup && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-end md:items-center justify-center">
          <div
            ref={popupRef}
            className="w-full md:w-[600px] bg-white rounded-t-2xl md:rounded-xl p-6"
          >
            <ReviewPopup
              onClose={() => setShowPopup(false)}
              onSubmit={(data) => {
                console.log("Review enviada:", data);
                setShowPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
