import { Routes, Route } from "react-router-dom";
import { routes } from "./config/routes";
import { useEffect, useState } from "react";
import useUserStore from "./store/useUserStore";
import axios from "axios";

export default function App() {
  const { setUser } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false); // clave para evitar doble render
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Intentamos obtener el usuario directamente
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            // 2. Intentamos refrescar el token
            await axios.post(`${API_URL}/api/auth/refresh`, {}, {
              withCredentials: true,
            });

            // 3. Reintentamos obtener el usuario
            const res = await axios.get(`${API_URL}/api/auth/me`, {
              withCredentials: true,
            });
            setUser(res.data.user);
          } catch (refreshErr) {
            // 4. Si falla el refresh, el usuario no está autenticado
            console.error("Token refresh failed", refreshErr);
            setUser(null);
          }
        } else {
          console.error("Error desconocido al verificar sesión", err);
          setUser(null);
        }
      } finally {
        // 5. Ya sabemos si el usuario está o no → podemos mostrar rutas
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [API_URL, setUser]);

  // 6. Mientras no sepamos si hay usuario, mostramos loading
  if (!authChecked) {
    return <div className="p-4 text-gray-600 animate-pulse">Verificando sesión...</div>;
  }

  // 7. Ya podemos renderizar rutas (privadas o públicas)
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}