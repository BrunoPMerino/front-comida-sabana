import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import ProductCard from "../components/ProductCard";
import ProductPopup from "../components/ProductPopup";

const API_URL = import.meta.env.VITE_API_URL;

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [restaurantError, setRestaurantError] = useState(false);
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, restaurantRes] = await Promise.all([
          axios.get(`${API_URL}/api/products/restaurant/${restaurantId}/public`),
          axios.get(`${API_URL}/api/restaurants/${restaurantId}`)
        ]);

        const productData = Array.isArray(productRes.data) ? productRes.data : [];
        setProducts(productData);

        setRestaurantInfo({
          name: restaurantRes.data.name,
          imageUrl: restaurantRes.data.imageUrl,
          averageScore: restaurantRes.data.averageScore || 0,
          estimatedTime: restaurantRes.data.estimatedTime || 0,
          _id: restaurantRes.data._id
        });
        setRestaurantError(false);
      } catch (error) {
        console.error("Error cargando productos o restaurante:", error);
        setProducts([]);
        setRestaurantError(true);
        setRestaurantInfo(null);
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
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

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

      <div className="mt-20 md:mt-24 px-4 md:px-8">

        {restaurantError && (
          <div className="text-center mt-20 text-red-600 text-lg font-semibold">
            No se pudo cargar la información del restaurante. Por favor, intenta más tarde o verifica el enlace.
          </div>
        )}

        {restaurantInfo && (
          <>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
              <img
                src={restaurantInfo.imageUrl}
                alt={restaurantInfo.name}
                className="w-full md:w-60 h-40 object-cover rounded"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002c66]">
                  {restaurantInfo.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-semibold">
                    {restaurantInfo.averageScore?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-yellow-400">★★★★★</span>
                  <button
                    onClick={() => {
                      navigate(`/reviews/${restaurantInfo._id}`, {state: { restaurantName: restaurantInfo.name }});}
                    }
                    className="text-blue-700 underline text-sm"
                  >
                    Ver las reseñas
                  </button>
                </div>
                <p className="text-sm mt-1">
                  Tiempo aproximado:{" "}
                  <strong>{Math.round(restaurantInfo.estimatedTime)} minutos</strong>
                </p>
              </div>
            </div>

            {products.length > 0 && (
              <div className="mt-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap text-sm sticky top-14 z-30 bg-white">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`inline-block px-4 py-2 font-semibold transition-colors duration-150 ${
                      activeCategory === cat
                        ? "text-[#002c66] border-b-2 border-[#002c66]"
                        : "text-gray-700 hover:border-b-2 hover:border-[#002c66]"
                    }`}
                    onClick={() => {
                      const el = document.getElementById(`section-${cat}`);
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              {categories.map((cat) => (
                <section
                  key={cat}
                  id={`section-${cat}`}
                  ref={(el) => (categoryRefs.current[cat] = el)}
                  className="mb-10"
                >
                  <h2 className="text-xl font-bold text-[#002c66] mb-4">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {categoryMap[cat].map((item) => (
                      <ProductCard
                        key={item._id}
                        image={item.imageUrl}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        stock={item.quantity}
                        onClick={() => setSelectedProduct(item)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {products.length === 0 && (
              <p className="text-center text-gray-500 mt-8">
                Este restaurante no tiene productos disponibles por ahora.
              </p>
            )}
          </>
        )}
      </div>

      <MobileNavbar />

      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}