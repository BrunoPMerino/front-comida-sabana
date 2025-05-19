export default function ProductInventoryCard({ product, onEdit }) {
  return (
    <div className="w-[170px] h-[220px] bg-white rounded-md shadow p-4 flex flex-col justify-between">
      <div className="w-full h-[100px] bg-gray-200 rounded relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
        <div
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs cursor-pointer"
          onClick={onEdit}
        >
          ✎
        </div>
      </div>

      <div className="mt-2 text-sm font-bold text-gray-900 truncate">{product.name}</div>
      <div className="text-xs text-gray-600 truncate">{product.description}</div>
      <div className="text-sm text-gray-800 font-semibold mt-1">
        ${product.price?.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500">
        Restantes: {product.quantity ?? 0}
      </div>
    </div>
  );
}
