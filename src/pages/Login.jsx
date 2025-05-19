import { useEffect, useState } from "react";
import axios from "axios";
import LogoHeader from "../components/LogoHeader";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

export default function Login() {
  const user = useUserStore((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return;
    if (user) navigate("/home");
  }, [user, navigate]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("Por favor ingresa un correo electrónico válido.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/auth/login`,
        { email: email.trim(), password: password.trim() },
        { withCredentials: true }
      );
      const meResponse = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      const user = meResponse.data.user;
      setUser(user);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMsg("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <LogoHeader />
      <AuthCard title="Inicio de sesión">
        <form onSubmit={handleLogin}>
          <FormInput
            label="Correo electrónico"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className="text-red-600 text-sm font-medium mb-4">
              {errorMsg}
            </p>
          )}

          <div className="text-sm mb-4">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-700 hover:underline">
              Regístrate
            </Link>
          </div>

          <PrimaryButton type="submit">Ingresar</PrimaryButton>
        </form>
      </AuthCard>
    </div>
  );
}