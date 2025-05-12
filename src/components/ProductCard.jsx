export default function ProductCard({ image, name, price, description }) {
  const validImage = image?.startsWith("http") ? image : "/placeholder.png";

  return (
    <div className="bg-white rounded-md shadow p-4 flex flex-col justify-between w-[200px] h-[260px] shrink-0">
      <img
        src={validImage}
        alt={name}
        className="w-full h-24 object-cover rounded-md mb-2"
      />
      <p className="text-sm font-semibold truncate">{name}</p>
      <p className="text-xs text-gray-500 mb-1 truncate">{description}</p>
      <p className="text-sm text-gray-800 font-medium">${price?.toLocaleString()}</p>
    </div>
  );
}