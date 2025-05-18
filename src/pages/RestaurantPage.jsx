import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import ProductCard from "../components/ProductCard";
import useUserStore from "../store/useUserStore";

const API_URL = import.meta.env.VITE_API_URL;

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const { user } = useUserStore();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/restaurant/${restaurantId}/public`);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);

        if (data.length > 0) {
          // Usa la información básica del primer producto para setear el restaurante
          setRestaurant({
            name: "Restaurante",
            imageUrl: "",
            _id: data[0].restaurantId
          });
        }
      } catch (error) {
        console.error("Error cargando productos del restaurante:", error);
        setProducts([]);
      }
    };
    fetchData();
  }, [restaurantId]);

  const categories = Array.from(new Set(products.flatMap(p => p.categories || [])));

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar />

      {restaurant && (
        <div className="mt-20 md:mt-24 px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <img src={restaurant.imageUrl} alt="Restaurante" className="w-full md:w-60 h-40 object-cover rounded" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#002c66]">{restaurant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-semibold">5.0</span>
                <span className="text-yellow-400">★★★★★</span>
                <button onClick={() => navigate(`/reviews?restaurantId=${restaurant._id}`)} className="text-blue-700 underline text-sm">Ver las reseñas</button>
              </div>
              <p className="text-sm mt-1">Tiempo aproximado: <strong>27 minutos</strong></p>
            </div>
          </div>

          <div className="mt-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap text-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                className="inline-block px-4 py-2 text-gray-700 font-semibold hover:border-b-2 hover:border-[#002c66]"
                onClick={() => {
                  const el = document.getElementById(`section-${cat}`);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {categories.map((cat) => (
              <section key={cat} id={`section-${cat}`} className="mb-10">
                <h2 className="text-xl font-bold text-[#002c66] mb-4">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.filter(p => p.categories.includes(cat)).map((item) => (
                    <ProductCard
                      key={item._id}
                      image={item.imageUrl}
                      name={item.name}
                      price={item.price}
                      description={item.description}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <MobileNavbar />
    </div>
  );
}
