import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../store/useUserStore";
import MobileNavbar from "../components/MobileNavbar";

export default function Menu() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/info`, {
          withCredentials: true,
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error al obtener productos:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate, API_URL]);

  if (loading) {
    return <p className="p-4 text-gray-600">Cargando menú...</p>;
  }

  return (
    <div className="relative min-h-screen pb-16">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Menú disponible</h1>
        <ul className="space-y-2">
          {products.map((product, index) => (
            <li key={index} className="border p-4 rounded shadow-sm bg-white">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="text-sm font-bold text-black">
                ${product.price.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <MobileNavbar />
    </div>
  );
}