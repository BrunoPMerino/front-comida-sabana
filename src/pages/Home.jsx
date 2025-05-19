import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import RestaurantHeader from "../components/RestaurantHeader";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import ProductPopup from "../components/ProductPopup";
import useUserStore from "../store/useUserStore";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      navigate("/");
      return;
    }

    if (user.role === "pos") {
      navigate(`/restaurant/${user.restaurantId}`);
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`, {
          withCredentials: true,
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurant and products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [API_URL, navigate, user]);

  if (user === undefined || loading) {
    return (
      <div className="p-4 text-gray-600 animate-pulse">
        Cargando restaurantes...
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">
        <h1 className="text-3xl font-bold mb-8 text-[#002c66]">
          Página Principal
        </h1>

        {restaurants.map((entry, idx) => (
          <div key={idx} className="mb-8">
            <RestaurantHeader
              name={entry.restaurant.name}
              rating={entry.restaurant.averageScore}
              deliveryTime={Number(entry.restaurant.estimatedTime).toFixed(1)}
              restaurantId={entry.restaurant._id}
            />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {(entry.products || []).map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedProduct(item)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    image={item.imageUrl}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    stock={item.quantity}
                    onClick={() => setSelectedProduct(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(productWithQuantity) => {
            console.log("Producto agregado al carrito:", productWithQuantity);
          }}
        />
      )}

      <MobileNavbar />
    </>
  );
}