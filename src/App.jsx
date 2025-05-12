import { Routes, Route, useNavigate } from "react-router-dom";
import { routes } from "./config/routes";
import { useEffect } from "react";
import useUserStore from "./store/useUserStore";
import axios from "axios";

export default function App() {
  const { user, setUser } = useUserStore();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            await axios.get(`${API_URL}/api/auth/refresh`, {
              withCredentials: true,
            });
            const res = await axios.get(`${API_URL}/api/auth/me`, {
              withCredentials: true,
            });
            setUser(res.data.user);
          } catch (refreshError) {
            console.log("Token refresh failed.");
            console.error(refreshError);
            setUser(null);
            navigate("/"); // redirige al login si refresh falla
          }
        } else {
          console.log("Usuario no autenticado o error desconocido.");
          console.error(error);
          setUser(null);
          navigate("/"); // redirige si otro error ocurre
        }
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, API_URL, navigate]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}