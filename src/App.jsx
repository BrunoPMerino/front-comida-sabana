import { Routes, Route } from "react-router-dom";
import { routes } from "./config/routes";
import { useEffect, useState } from "react";
import useUserStore from "./store/useUserStore";
import axios from "axios";
import Pusher from 'pusher-js';
import StatusNotification from "./components/StatusNotification"; 

export default function App() {
  const { user, setUser } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // Estado para mostrar la notificación
  const [notificationMessage, setNotificationMessage] = useState(""); // Mensaje de la notificación
  const [notificationType, setNotificationType] = useState("success"); // Tipo de notificación
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
  if (!authChecked || !user?._id) return;

  console.log('✅ Usuario logueado:', user._id);

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  });

  const channel = pusher.subscribe(`user-${user._id}`);

  channel.bind('order-status-updated', (data) => {
    console.log('Estado de la orden actualizado:', data);
    setNotificationMessage(`Una de tus ordenes ahora está en estado "${data.newStatus}"`);
    setNotificationType("success"); // Puedes ajustar el tipo según el estado   
    setShowNotification(true);
  });

  return () => {
    channel.unbind_all();
    pusher.disconnect();
  };
}, [authChecked, user?._id]);


  const handleCloseNotification = () => {
    setShowNotification(false);
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
      <Routes>
        {routes.map((route) => (
          <Route key={route.id} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </>
  );
}