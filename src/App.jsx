import { Routes, Route } from "react-router-dom";
import { routes } from "./config/routes";
import { useEffect } from "react";
import useUserStore from "./store/useUserStore";

export default function App() {
  const { user, setUser } = useUserStore();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log("Usuario no autenticado o sesión expirada.");
        setUser(null); // limpiar en caso de error
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, API_URL]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}
