import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../store/useUserStore";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function InventoryPage() {
  const { user, setUser } = useUserStore();
  const [products, setProducts] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data);

        if (response.data.role !== "pos") {
          navigate("/");
        } else {
          setRestaurantId(response.data.restaurantId);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate, setUser]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!restaurantId) return;
      try {
        const response = await axios.get(`${API_URL}/api/orders/restaurant/${restaurantId}`, {
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar inventario:", error);
      }
    };

    fetchInventory();
  }, [restaurantId]);

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">
        <h1 className="text-3xl font-bold mb-6">Inventario</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div key={product._id} className="relative border p-2 rounded-md">
              <div className="w-full aspect-square bg-gray-200 rounded relative">
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs cursor-pointer">
                  ✎
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-800 font-semibold">${product.price}</div>
              <div className="text-xs text-gray-500">Restantes: {product.stock}</div>
            </div>
          ))}

          {/* Botón para añadir producto */}
          <div className="border p-4 flex flex-col items-center justify-center cursor-pointer">
            <div className="text-4xl font-bold">+</div>
            <div className="text-sm mt-2">Añadir producto</div>
          </div>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
}
