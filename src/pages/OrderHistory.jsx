import axios from "axios";
import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;

export default function OrderHistory() {
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  


  const isPOS = user?.role === "pos";



  
  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const endpoint = isPOS
          ? `${API_URL}/api/orders/restaurant/${user.restaurantId}`
          : `${API_URL}/api/orders/mine`;

        const response = await axios.get(endpoint, { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    if (user) fetchOrders();
  }, [user, isPOS]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-CO", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.patch(
        `${API_URL}/api/orders/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("Error cancelando pedido:", err);
    }
  };

  const handleAdvance = () => {
    if (user) {
      const endpoint = isPOS
        ? `${API_URL}/api/orders/restaurant/${user.restaurantId}`
        : `${API_URL}/api/orders/mine`;

      axios
        .get(endpoint, { withCredentials: true })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error(err));
    }
  };

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  return (
    <>
      <TopNavbar />
      <div className="px-4 pt-20 pb-28">
        <h1 className="text-3xl font-bold mb-8 text-[#002c66]">
          {isPOS ? "Órdenes del restaurante" : "Historial de pedidos"}
        </h1>

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
                userRole={user.role}
                onCancel={handleCancel}
                onAdvance={handleAdvance}
                formatTime={formatTime}
              />
            ))
          )}
        </div>

        <h2 className="text-lg font-semibold mb-2">Finalizados</h2>
        <div className="space-y-4 mb-6">
          {completedOrders.length === 0 ? (
            <p className="text-gray-500">Sin historial de pedidos.</p>
          ) : (
            completedOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                userRole={user.role}
                formatTime={formatTime}
              />
            ))
          )}
        </div>

        <h2 className="text-lg font-semibold mb-2">Cancelados</h2>
        <div className="space-y-4">
          {cancelledOrders.length === 0 ? (
            <p className="text-gray-500">Sin pedidos cancelados.</p>
          ) : (
            cancelledOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                userRole={user.role}
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