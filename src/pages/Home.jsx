import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import RestaurantHeader from "../components/RestaurantHeader";
import useUserStore from "../store/useUserStore";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Si la validación inicial aún no termina (user es undefined), no hacer nada
    if (user === undefined) return;

    // Si el usuario no está autenticado, redirigir
    if (!user) {
      navigate("/");
      return;
    }

    const fetchRestaurantWithProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`, {
          withCredentials: true,
        });

        const { restaurant, products } = response.data;

        setRestaurants([
          {
            ...restaurant,
            products,
          },
        ]);
      } catch (error) {
        console.error("Error fetching restaurant and products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantWithProducts();
  }, [API_URL, navigate, user]);

  if (loading) {
    return <div className="p-4 text-gray-600 animate-pulse">Cargando restaurantes...</div>;
  }

  return (
    <div className="px-4 py-6">
      {restaurants.map((restaurant, idx) => (
        <div key={idx} className="mb-8">
          <RestaurantHeader
            name={restaurant.name}
            rating={restaurant.rating}
            deliveryTime={restaurant.deliveryTime}
          />

          <div className="flex gap-4 overflow-x-auto pb-2">
            {(restaurant.products || []).map((item, index) => (
              <ProductCard
                key={index}
                image={item.image}
                name={item.name}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}