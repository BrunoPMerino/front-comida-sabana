export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex gap-4 border-b mb-4 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`pb-2 px-2 text-sm font-medium ${
            activeCategory === cat ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}