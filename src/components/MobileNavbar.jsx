import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaListAlt, FaShoppingCart } from "react-icons/fa";

export default function MobileNavbar() {
  const { pathname } = useLocation();

  // Puedes personalizar esto si quieres ocultarla en algunas rutas
  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#00296B] text-white flex justify-around items-center h-14 md:hidden z-50 shadow-inner">
      <Link to="/home" aria-label="Home">
        <FaHome className="w-6 h-6" />
      </Link>
      <Link to="/menu" aria-label="Menu">
        <FaMapMarkerAlt className="w-6 h-6" />
      </Link>
      <Link to="/login" aria-label="Login">
        <FaListAlt className="w-6 h-6" />
      </Link>
      <Link to="/register" aria-label="Register">
        <FaShoppingCart className="w-6 h-6" />
      </Link>
    </nav>
  );
}