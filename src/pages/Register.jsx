import { useState } from "react";
import axios from "axios";
import LogoHeader from "../components/LogoHeader";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 Estado para el error

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Limpia el error anterior

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      }, { withCredentials: true });

      const meResponse = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
      const user = meResponse.data.user;

      useUserStore.setUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registro fallido:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Ocurrió un error durante el registro.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <LogoHeader />
      <AuthCard title="Crear cuenta">
        <form onSubmit={handleRegister}>
          <div className="flex gap-4">
            <div className="w-1/2">
              <FormInput
                label="Nombre"
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <FormInput
                label="Apellido"
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

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

          {error && (
            <div className="text-red-600 text-sm mb-2 font-medium">
              {error}
            </div>
          )}

          <div className="text-sm mb-4">
            <Link to="/" className="text-blue-700 hover:underline">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>

          <PrimaryButton type="submit">Registrarte</PrimaryButton>
        </form>
      </AuthCard>
    </div>
  );
}