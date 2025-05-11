import { useState } from "react";
import axios from "axios";
import LogoHeader from "../components/LogoHeader";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { Link } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  //const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/login`, { email, password }, {withCredentials: true,});
      const meResponse = await axios.get(`${API_URL}/api/auth/me`, {withCredentials: true,});
      const user = meResponse.data.user;
      useUserStore.setUser(user); // saves in Zustand
      //navigate("/dashboard");
    } catch (error) {
      console.error("Login failed: ", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <LogoHeader />
      <AuthCard title="Inicio de sesión">
        <form> //onSubmit?
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

          {/* Comentado: ¿Olvidaste tu contraseña?
          <div className="text-sm mb-2">
            <a href="/change-password" className="text-blue-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          */}

            <div className="text-sm mb-4">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-blue-700 hover:underline">
                    Regístrate
                </Link>
            </div>

          <PrimaryButton onClick={handleLogin}>Ingresar</PrimaryButton> //maybe change button on click functionality
        </form>
      </AuthCard>
    </div>
  );
}