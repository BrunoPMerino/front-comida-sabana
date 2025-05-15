export default function OrderCard({ order, isActive = false, onCancel, formatTime }) {
    return (
      <div
        key={order._id}
        className={`border p-4 rounded-md ${isActive ? "bg-white border-black" : "bg-gray-100 text-gray-500"}`}
      >
        <div className="flex justify-between items-start">
          <div className="font-bold text-lg mb-1">{order.restaurantId.name}</div>
          {isActive && (
            <button
              className="text-xs border border-black rounded p-1"
              onClick={() => onCancel(order._id)}
            >
              <span className="text-xs">❌</span> Cancelar
            </button>
          )}
        </div>
  
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <ul className="text-sm list-disc list-inside">
            {order.products.map((p) => (
              <li key={p._id}>{p.productId.name}</li>
            ))}
          </ul>
          <div className="text-sm">
            <p>
              <span className="font-bold">Precio:</span> ${order.totalPrice.toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Estado:</span> {order.status === "pending" ? "Cooking" : order.status}
            </p>
            <p>
              <span className="font-bold">Hora de entrega:</span> {formatTime(order.reservationDate)}
            </p>
          </div>
        </div>
      </div>
    );
  }