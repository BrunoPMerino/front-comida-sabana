import ProductCard from "./ProductCard";

export default function ProductGrid({ categories, activeCategory, products }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div
          key={category}
          className={activeCategory !== category ? "hidden" : ""}
        >
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
          <div className="flex flex-wrap gap-4">
            {products.map((product, idx) => (
              <ProductCard
                image={product.imageUrl}
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.quantity} 
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
