import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import useUserStore from "../store/useUserStore";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";

export default function ReviewsPage() {
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  useEffect(() => {
  if (!user) {
    navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/reviews/${restaurantId}`
        );
      const transformed = response.data.map(r => ({
        userName: r.userId?.name ?? "Usuario anonimo",
        rating: r.score,             // adaptar `score` → `rating`
        comment: r.comment
      }));
        setReviews(transformed);
      } catch (error) {
        console.error("Error al obtener reseñas:", error);
      }
    };

    fetchReviews();
  }, [API_URL, restaurantId]);

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="md:hidden">
              <FaArrowLeft className="text-xl text-[#002c66]" />
            </button>
            <h1 className="text-3xl font-bold mb-8 text-[#002c66]">
              <span className="md:hidden">Reseñas</span>
              <span className="hidden md:inline">Reseñas de Embarcadero</span>
            </h1>
          </div>
        </div>

        {!reviews ||
        reviews.length === 0 ||
        !reviews.some((r) => r.comment || r.userName) ? (
          <p className="text-gray-500">
            Este restaurante aún no tiene reseñas.
          </p>
        ) : (
          reviews.map((review, index) =>
            review.comment || review.userName ? (
              <div key={index} className="border-b border-gray-200 pb-6 mb-6">
                <p className="font-bold">
                  {review.userName || "Usuario anónimo"}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  {review.rating && (
                    <span className="text-black font-medium ml-2">
                      {Number(review.rating).toFixed(1)}
                    </span>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ) : null
          )
        )}
      </div>
      <MobileNavbar />
    </>
  );
}
