import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../store/useUserStore";

export default function useAuthRedirect({ expectedRole, redirectTo = "/" }) {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          withCredentials: true,
        });

        const currentUser = res.data.user;
        setUser(currentUser);

        // Redirige si no hay usuario o el rol no es el esperado
        if (!currentUser || (expectedRole && currentUser.role !== expectedRole)) {
          navigate(redirectTo);
        }
      } catch (err) {
        console.error("Fallo en la verificación del usuario:", err);
        navigate(redirectTo);
      }
    };

    checkAuth();
  }, [expectedRole, navigate, setUser]);
}