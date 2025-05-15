import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import RestaurantHeader from "../components/RestaurantHeader";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import UserInfoPopup from "../components/UserInfoPopup";
import ProductPopup from "../components/ProductPopup";
import useUserStore from "../store/useUserStore";

export default function RestaurantList() {
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
    return <div className="p-4 text-gray-600 animate-pulse">Cargando restaurantes...</div>;
  }

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">
        <h1 className="text-3xl font-bold mb-8 text-[#002c66]">Página Principal</h1>

        {restaurants.map((entry, idx) => (
          <div key={idx} className="mb-8">
            <RestaurantHeader
              name={entry.restaurant.name}
              rating={entry.restaurant.averageScore}
              deliveryTime={entry.restaurant.estimatedTime}
            />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {(entry.products || []).map((item, index) => (
                <div key={index} onClick={() => setSelectedProduct(item)} className="cursor-pointer">
                  <ProductCard
                    image={item.imageUrl}
                    name={item.name}
                    price={item.price}
                    description={item.description}
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