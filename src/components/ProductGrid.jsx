import ProductCard from "./ProductCard";

export default function ProductGrid({ categories, activeCategory, products }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className={activeCategory !== category ? "hidden" : ""}>
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category === category)
              .map((product, idx) => (
                <ProductCard
                  key={idx}
                  image={product.image}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
