import axios from "axios";

const statusFlow = ["pending", "confirmed", "preparing", "ready", "delivered"];

export default function OrderCard({
  order,
  isActive = false,
  formatTime,
  onCancel,
  userRole,
  onAdvance
}) {
  const isPOS = userRole === "pos";

  const canAdvance =
    isPOS &&
    statusFlow.includes(order.status) &&
    order.status !== "delivered" &&
    order.status !== "cancelled";

  const canCancel =
    ["pending", "confirmed", "preparing"].includes(order.status) &&
    typeof onCancel === "function";

  const handleAdvance = async () => {
    const currentIndex = statusFlow.indexOf(order.status);
    const nextStatus = statusFlow[currentIndex + 1];
    if (!nextStatus) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/orders/${order._id}/status`,
        { status: nextStatus },
        { withCredentials: true }
      );
      if (onAdvance) onAdvance();
    } catch (error) {
      console.error("Error avanzando estado:", error.response?.data || error.message);
    }
  };

  return (
    <div
      className={`border p-4 rounded-md ${!isActive ? "bg-gray-100 text-gray-500" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="font-bold text-lg mb-1">
          {isPOS
            ? `Cliente: ${order.name || ""} ${order.lastName || ""}`
            : order.restaurantId?.name || "Restaurante"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <ul className="text-sm list-disc list-inside">
          {order.products.map((p, idx) => (
            <li key={idx}>
              {p.productId?.name || "Producto eliminado"}
            </li>
          ))}
        </ul>

        <div className="text-sm">
          <p>
            <span className="font-bold">Estado:</span> {order.status}
          </p>
          <p>
            <span className="font-bold">Reservado para:</span>{" "}
            {formatTime(order.reservationDate)}
          </p>
          <p>
            <span className="font-bold">Total:</span>{" "}
            ${order.totalPrice.toLocaleString()}
          </p>

          {/* Avanzar estado solo para POS */}
          {isPOS && (
            <button
              onClick={handleAdvance}
              disabled={!canAdvance}
              className={`mt-2 px-3 py-1 rounded text-xs font-medium transition ${
                canAdvance
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Avanzar estado
            </button>
          )}

          {/* Cancelar pedido para POS y cliente */}
          {canCancel && (
            <button
              onClick={() => onCancel(order._id)}
              className="mt-2 ml-2 text-sm border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
