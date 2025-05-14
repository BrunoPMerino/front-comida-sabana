export default function CartSummary({ subtotal, onSubmit }) {
  return (
    <div className="border-t pt-4">
      <p className="text-sm mb-1 font-medium text-gray-700">Subtotal</p>
      <p className="text-lg font-bold mb-4">${subtotal.toLocaleString()}</p>
      <button
        onClick={onSubmit}
        className="bg-[#002c66] text-white w-full py-2 rounded font-semibold hover:bg-[#001a4d] transition"
      >
        Finalizar pedido
      </button>
    </div>
  );
}