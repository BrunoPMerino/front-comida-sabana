export default function ProductCard({ image, name, price, description, stock, onClick }) {
  const validImage = image?.startsWith("http") ? image : "/placeholder.png";

  return (
    <div
      className="bg-white rounded-md shadow p-4 flex flex-col justify-between w-[170px] h-[240px] shrink-0 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <img
        src={validImage}
        alt={name}
        onError={(e) => (e.target.src = "/placeholder.png")}
        className="w-full h-24 object-cover rounded-md mb-2"
      />
      <p className="text-base font-semibold truncate">{name}</p>
      <p className="text-xs text-gray-500 mb-1 truncate">{description}</p>
      <p className="text-sm text-gray-800 font-medium mb-1">
        ${price?.toLocaleString()}
      </p>

      {typeof stock === "number" && (
        <p className={`text-xs font-medium ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {stock > 0 ? `Quedan ${stock} disponibles` : "Sin stock"}
        </p>
      )}
    </div>
  );
}