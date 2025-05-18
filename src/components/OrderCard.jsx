export default function OrderCard({ order, isActive = false, onCancel, formatTime, isCancelling = false }) {
  const restaurantName = order?.restaurantId?.name || "Restaurante desconocido";
  const products = Array.isArray(order?.products) ? order.products : [];

  return (
    <div
      key={order._id}
      className={`border p-4 rounded-md ${
        isActive ? "bg-white border-black" : "bg-gray-100 text-gray-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="font-bold text-lg mb-1">{restaurantName}</div>
        {isActive && (
          <button
            className="text-xs border border-black rounded p-1"
            onClick={() => onCancel(order._id)}
            disabled={isCancelling}
          >
            <span className="text-xs">
              {isCancelling ? "Cancelando..." : "❌ Cancelar"}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <ul className="text-sm list-disc list-inside">
          {products.map((p) => (
            <li key={p._id}>
              {p?.productId?.name || "Producto descontinuado"}
            </li>
          ))}
        </ul>
        <div className="text-sm">
          <p>
            <span className="font-bold">Precio:</span> $
            {typeof order.totalPrice === "number"
              ? order.totalPrice.toLocaleString()
              : "N/A"}
          </p>
          <p>
            <span className="font-bold">Estado:</span>{" "}
            {order.status === "pending"
              ? "Cooking"
              : order.status || "Desconocido"}
          </p>
          <p>
            <span className="font-bold">Hora de entrega:</span>{" "}
            {order.reservationDate
              ? formatTime(order.reservationDate)
              : "Sin fecha"}
          </p>
        </div>
      </div>
    </div>
  );
}
