import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPopup({ countdown, setCountdown, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      onClose();
      navigate("/history");
    }
    return () => clearTimeout(timer);
  }, [countdown, setCountdown, onClose, navigate]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          Pedido realizado correctamente
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Serás redirigido en {countdown} segundo{countdown !== 1 ? 's' : ''}...
        </p>
        <button
          onClick={() => {
            onClose();
            navigate("/history");
          }}
          className="mt-2 px-4 py-2 text-sm font-semibold bg-[#002c66] text-white rounded hover:bg-[#001a4d] transition"
        >
          Ir ahora
        </button>
      </div>
    </div>
  );
}