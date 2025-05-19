import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import CartPopup from "./CartPopup";
import UserInfoPopup from "./UserInfoPopup";
import Sidebar from "./Sidebar";
import useUserStore from "../store/useUserStore";

export default function TopNavbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const popupRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const isPOS = user?.role === "pos";

  const togglePopup = () => setShowPopup(!showPopup);
  const toggleCart = () => setShowCart(!showCart);

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
        {!isPOS && (
          <div
            className="hidden md:block mr-4 cursor-pointer"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars className="text-xl text-[#002c66]" />
          </div>
        )}

        <Link to="/home" className="flex items-center gap-2 hover:underline">
          <img src="/Unisabana-logo.png" alt="Logo" className="h-6 md:h-8" />
          <span className="font-bold text-[#002c66] text-sm md:text-lg">
            Comida Sabana
          </span>
        </Link>

        {isPOS ? (
          <div className="flex items-center gap-4 ml-auto">
            {/* Inventario */}
            <div
              className="hidden md:flex items-center gap-1 cursor-pointer"
              onClick={() => navigate("/inventory")}
            >
              <BsBoxSeam
                className={`text-xl ${
                  location.pathname === "/inventory"
                    ? "text-yellow-400"
                    : "text-[#002c66]"
                }`}
              />
              <span
                className={`font-medium ${
                  location.pathname === "/inventory"
                    ? "text-yellow-400"
                    : "text-[#002c66]"
                }`}
              >
                Inventario
              </span>
            </div>

            {/* Órdenes */}
            <div
              className="hidden md:flex items-center gap-1 cursor-pointer"
              onClick={() => navigate("/history")}
            >
              <HiOutlineClipboardList
                className={`text-xl ${
                  location.pathname === "/history"
                    ? "text-yellow-400"
                    : "text-[#002c66]"
                }`}
              />
              <span
                className={`font-medium ${
                  location.pathname === "/history"
                    ? "text-yellow-400"
                    : "text-[#002c66]"
                }`}
              >
                Órdenes
              </span>
            </div>

            {/* Perfil */}
            <div className="flex items-center gap-1 cursor-pointer" onClick={togglePopup}>
              <FaUser
                className={`text-xl ${
                  showPopup ? "text-yellow-400" : "text-[#002c66]"
                }`}
              />
              <span
                className={`hidden md:inline font-medium ${
                  showPopup ? "text-yellow-400" : "text-[#002c66]"
                }`}
              >
                Perfil
              </span>
            </div>

            {/* Carrito */}
            <div
              className="hidden md:flex items-center gap-1 cursor-pointer"
              onClick={toggleCart}
            >
              <FaShoppingCart
                className={`text-xl ${
                  showCart ? "text-yellow-400" : "text-[#002c66]"
                }`}
              />
              <span
                className={`font-medium ${
                  showCart ? "text-yellow-400" : "text-[#002c66]"
                }`}
              >
                Carrito
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <div className="block md:hidden cursor-pointer" onClick={togglePopup}>
              <FaUser className="text-xl text-[#002c66]" />
            </div>
            <div className="hidden md:block cursor-pointer" onClick={toggleCart}>
              <FaShoppingCart className="text-xl text-[#002c66]" />
            </div>
          </div>
        )}
      </div>

      <UserInfoPopup showPopup={showPopup} setShowPopup={setShowPopup} />
      {showCart && <CartPopup onClose={() => setShowCart(false)} />}
      {!isPOS && showSidebar && (
        <Sidebar isOpen={true} onClose={() => setShowSidebar(false)} />
      )}
    </header>
  );
}
