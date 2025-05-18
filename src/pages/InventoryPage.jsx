import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import ProductInventoryCard from "../components/ProductInventoryCard";
import EditProductPopup from "../components/EditProductPopup";

const API_URL = import.meta.env.VITE_API_URL;

export default function InventoryPage() {
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== "pos") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/restaurant/${user.restaurantId}`, {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsNew(false);
  };

  const handleAddNew = () => {
    setEditingProduct({});
    setIsNew(true);
  };

  const handleSave = () => {
    setEditingProduct(null);
    setIsNew(false);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <TopNavbar />
      <main className="flex-1 px-4 pt-20 pb-28 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Inventario</h1>
        <div className="flex flex-wrap gap-4 justify-start">
          {products.map((product) => (
            <ProductInventoryCard key={product._id} product={product} onEdit={() => handleEdit(product)} />
          ))}
          <div
            onClick={handleAddNew}
            className="w-[170px] h-[220px] flex flex-col items-center justify-center border-2 border-black border-dashed cursor-pointer"
          >
            <span className="text-2xl">+</span>
            <span className="text-xs">Añadir producto</span>
          </div>
        </div>
      </main>
      <MobileNavbar />

      {editingProduct !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <EditProductPopup
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSave}
            isNew={isNew}
          />
        </div>
      )}
    </div>
  );
}