import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaListAlt, FaShoppingCart } from "react-icons/fa";

export default function MobileNavbar({ isDisabled = false }) {
  const { pathname } = useLocation();

  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-[#00296B] text-white flex justify-around items-center h-14 md:hidden z-40 shadow-inner transition-opacity duration-300 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <Link to="/home" aria-label="Home">
        <FaHome className="w-6 h-6" />
      </Link>
      <Link to="/menu" aria-label="Menu">
        <FaMapMarkerAlt className="w-6 h-6" />
      </Link>
      <Link to="/reviews" aria-label="Login">
        <FaListAlt className="w-6 h-6" />
      </Link>
      <Link to="/register" aria-label="Register">
        <FaShoppingCart className="w-6 h-6" />
      </Link>
    </nav>
  );
}
