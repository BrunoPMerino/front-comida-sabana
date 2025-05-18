import { useEffect, useState, useRef } from "react";
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
  const [activeCategory, setActiveCategory] = useState("");
  const categoryRefs = useRef({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, restaurantRes] = await Promise.all([
          axios.get(`${API_URL}/api/products/restaurant/${restaurantId}/public`),
          axios.get(`${API_URL}/api/restaurants/${restaurantId}`)
        ]);

        const productData = Array.isArray(productRes.data) ? productRes.data : [];
        setProducts(productData);
        setRestaurant(restaurantRes.data);
      } catch (error) {
        console.error("Error cargando productos o restaurante:", error);
        setProducts([]);
        setRestaurant(null);
      }
    };
    fetchData();
  }, [restaurantId]);

  const categoryMap = products.reduce((acc, product) => {
    const uniqueCategories = new Set((product.categories || []).map(cat => cat.trim().toLowerCase()));
    uniqueCategories.forEach((normalized) => {
      if (!acc[normalized]) acc[normalized] = [];
      acc[normalized].push(product);
    });
    return acc;
  }, {});

  const categories = Object.keys(categoryMap);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const current = Object.entries(categoryRefs.current).find(
              ([key, ref]) => ref === entry.target
            );
            if (current) setActiveCategory(current[0]);
            break;
          }
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0.1 }
    );

    categories.forEach(cat => {
      if (categoryRefs.current[cat]) {
        observer.observe(categoryRefs.current[cat]);
      }
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar />

      {restaurant && (
        <div className="mt-20 md:mt-24 px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full md:w-60 h-40 object-cover rounded" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#002c66]">{restaurant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-semibold">{restaurant.averageScore?.toFixed(1) || "0.0"}</span>
                <span className="text-yellow-400">★★★★★</span>
                <button
                  onClick={() => navigate(`/reviews?restaurantId=${restaurant._id}`)}
                  className="text-blue-700 underline text-sm"
                >
                  Ver las reseñas
                </button>
              </div>
              <p className="text-sm mt-1">
                Tiempo aproximado: <strong>{Math.round(restaurant.estimatedTime || 0)} minutos</strong>
              </p>
            </div>
          </div>

          <div className="mt-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap text-sm sticky top-14 z-30 bg-white">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`inline-block px-4 py-2 font-semibold transition-colors duration-150 ${activeCategory === cat ? "text-[#002c66] border-b-2 border-[#002c66]" : "text-gray-700 hover:border-b-2 hover:border-[#002c66]"}`}
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
              <section
                key={cat}
                id={`section-${cat}`}
                ref={el => (categoryRefs.current[cat] = el)}
                className="mb-10"
              >
                <h2 className="text-xl font-bold text-[#002c66] mb-4">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                <div className="flex flex-wrap gap-4">
                  {categoryMap[cat].map((item) => (
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