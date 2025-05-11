export default function ProductCard({ image, name, price, description }) {
  return (
    <div className="min-w-[140px] bg-white rounded-md shadow p-2">
      <img
        src={image || "/placeholder.png"}
        alt={name}
        className="w-full h-24 object-cover rounded-md mb-2"
      />
      <p className="text-sm font-semibold truncate">{name}</p>
      <p className="text-xs text-gray-500 mb-1 truncate">{description}</p>
      <p className="text-sm text-gray-800 font-medium">${price.toLocaleString()}</p>
    </div>
  );
}
