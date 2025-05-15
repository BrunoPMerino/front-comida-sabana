import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
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
      }
    };

    fetchOrders();
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const activeOrders = orders.filter((o) => o.status === "pending");
  const pastOrders = orders.filter((o) => o.status !== "pending");

  const handleCancel = (orderId) => {
    console.log("Cancelar", orderId); // Placeholder
  };

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">
        <h1 className="text-3xl font-bold mb-8 text-[#002c66]">Historial de pedidos</h1> 

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
              />
            ))
          )}
        </div>

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
      </div>
      <MobileNavbar />
    </>
  );
}
