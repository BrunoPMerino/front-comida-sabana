import { Routes, Route } from "react-router-dom";
import { routes } from "./config/routes";
import { useEffect, useState } from "react";
import useUserStore from "./store/useUserStore";
import axios from "axios";
import Pusher from 'pusher-js';
import StatusNotification from "./components/StatusNotification"; 
import ReviewPopup from "./components/ReviewPopup"; 

export default function App() {
  const { user, setUser } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // Estado para mostrar la notificación
  const [notificationMessage, setNotificationMessage] = useState(""); // Mensaje de la notificación
  const [notificationType, setNotificationType] = useState("success"); // Tipo de notificación
  const [showReviewPopup, setShowReviewPopup] = useState(false); // Estado para el popup de reseña
  const [reviewedOrderId, setReviewedOrderId] = useState(null); // ID de la orden a reseñar
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            await axios.post(`${API_URL}/api/auth/refresh`, {}, {
              withCredentials: true,
            });
            const res = await axios.get(`${API_URL}/api/auth/me`, {
              withCredentials: true,
            });
            setUser(res.data.user);
          } catch (refreshErr) {
            console.error("Token refresh failed", refreshErr);
            setUser(null);
          }
        } else {
          console.error("Error desconocido al verificar sesión", err);
          setUser(null);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [API_URL, setUser]);

  //Integracion con pusher
  useEffect(() => {
  if (!authChecked || !user?._id){
    setShowReviewPopup(false); // Reinicia el estado si no hay usuario autenticado
    setReviewedOrderId(null);
    setCurrentRestaurantId(null);
    return;
  }
  console.log('✅ Usuario logueado:', user._id);

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  });

  const channel = pusher.subscribe(`user-${user._id}`);

  channel.bind('order-status-updated', (data) => {
    console.log('Estado de la orden actualizado:', data);
    if (data.newStatus === 'delivered') {
      setReviewedOrderId(data.orderId);
      setShowReviewPopup(true);
      setCurrentRestaurantId(data.restaurantId);
    } else {
      setNotificationMessage(`Una de tus ordenes ahora está en estado "${data.newStatus}"`);
      setNotificationType("success");
      setShowNotification(true);
    }
  });

  return () => {
    channel.unbind_all();
    pusher.disconnect();
  };
}, [authChecked, user?._id]);


  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleCloseReviewPopup = () => {
    setShowReviewPopup(false);
    setReviewedOrderId(null);
    setCurrentRestaurantId(null); // También reinicia el restaurantId
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!reviewedOrderId || !user?._id || !currentRestaurantId) {
      console.error("Faltan datos para enviar la reseña.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/reviews`, {
        userId: user._id,
        restaurantId: currentRestaurantId, 
        orderId: reviewedOrderId,
        score: reviewData.rating,
        comment: reviewData.comment,
      });

      console.log('Reseña enviada con éxito:', response.data);
      // Opcional: Mostrar un mensaje de éxito al usuario
      handleCloseReviewPopup();
    } catch (error) {
      console.error('Error al enviar la reseña:', error.response?.data?.message || error.message);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  };

  // 6. Mientras no sepamos si hay usuario, mostramos loading
  if (!authChecked) {
    return <div className="p-4 text-gray-600 animate-pulse">Verificando sesión...</div>;
  }

  // 7. Ya podemos renderizar rutas (privadas o públicas)
  return (
    <>
      {showNotification && (
        <StatusNotification
          message={notificationMessage}
          onClose={handleCloseNotification}
          type={notificationType}
        />
      )}
      {showReviewPopup && user && (
        <ReviewPopup
          isOpen={true}
          onClose={handleCloseReviewPopup}
          onSubmit={handleReviewSubmit}
        />
      )}
      <Routes>
        {routes.map((route) => (
          <Route key={route.id} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </>
  );
}