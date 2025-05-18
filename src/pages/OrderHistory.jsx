import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/mine`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        setError("No se pudieron cargar los pedidos.");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchOrders();
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCancel = async (orderId) => {
    setCancellingOrderId(orderId);
    try {
      await axios.patch(`${API_URL}/api/orders/cancel/${orderId}`, {}, {
        withCredentials: true,
      });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );

      setSuccessMessage("Pedido cancelado con éxito.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al cancelar el pedido:", error.response?.data || error.message);
      setError("Hubo un error al cancelar el pedido.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Clasificación de pedidos
  const activeOrders = orders.filter((o) => o.status === "pending");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const pastOrders = orders.filter((o) => o.status !== "pending" && o.status !== "cancelled");

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">

        <h1 className="text-3xl font-bold mb-8 text-[#002c66]">Historial de pedidos</h1>

        {/* 🟢 Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 font-semibold">
            {successMessage}
          </div>
        )}

        {/* 🔴 Mensaje de error */}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 font-semibold">
            {error}
          </div>
        )}

        {/* En curso */}
        <h2 className="text-lg font-semibold mb-2">En curso</h2>
        <div className="space-y-4 mb-6">
          {activeOrders.length === 0 ? (
            <p className="text-gray-500">Sin pedidos activos.</p>
          ) : (
            activeOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isActive={true}
                onCancel={handleCancel}
                formatTime={formatTime}
                isCancelling={cancellingOrderId === order._id}
              />
            ))
          )}
        </div>

        {/* Finalizados */}
        <h2 className="text-lg font-semibold mb-2">Finalizados</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pastOrders.length === 0 ? (
            <p className="text-gray-500">Sin historial de pedidos.</p>
          ) : (
            pastOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                formatTime={formatTime}
              />
            ))
          )}
        </div>

        {/* Cancelados */}
        <h2 className="text-lg font-semibold mb-2 mt-8">Cancelados</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {cancelledOrders.length === 0 ? (
            <p className="text-gray-500">No hay pedidos cancelados.</p>
          ) : (
            cancelledOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                formatTime={formatTime}
              />
            ))
          )}
        </div>
      </div>
      <MobileNavbar />
    </>
  );
}