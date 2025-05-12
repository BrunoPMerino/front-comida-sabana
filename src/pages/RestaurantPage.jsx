import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../store/useUserStore";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/restaurant/${restaurantId}/public`, {
          withCredentials: true
        });
        setRestaurant(response.data.restaurant);
        setProducts(response.data.products);

        const cats = [...new Set(response.data.products.map(p => p.category))];
        setCategories(cats);
        setActiveCategory(cats[0]);
      } catch (err) {
        console.error("Error loading restaurant data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantId, API_URL, user, navigate]);

  if (loading) return <p className="p-4 animate-pulse text-gray-600">Cargando restaurante...</p>;

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <div className="flex items-center gap-2 text-yellow-500">
          {Array(5).fill().map((_, i) => (
            <span key={i}>★</span>
          ))}
          <a href="#" className="text-blue-600 text-sm ml-2 underline">Ver las reseñas</a>
        </div>
        <p className="text-sm text-gray-500 mt-1">Tiempo aproximado: <strong>{restaurant.deliveryTime} minutos</strong></p>
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <ProductGrid
        categories={categories}
        activeCategory={activeCategory}
        products={products}
      />
    </div>
  );
}