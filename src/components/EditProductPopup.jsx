import { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaTrash, FaPlus, FaMinus, FaCamera } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProductPopup({ product, onClose, onSave, isNew = false }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    categories: "",
    available: true,
    imageUrl: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        categories: (product.categories || []).join(", "),
        available: product.available ?? true,
        imageUrl: product.imageUrl || ""
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    console.log("Uploading image:", imageFile);
    const { data: uploadUrl } = await axios.get(`${API_URL}/api/s3/get-url`);
    console.log("Upload URL:", uploadUrl);
    console.log("uploadUrl test 2: ", uploadUrl.url);
    await axios.put(uploadUrl.url, imageFile, {
      headers: { "Content-Type": imageFile.type },
    });
    return uploadUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        console.log(imageFile);
        imageUrl = await handleUploadImage();
      }

      const payload = {
        ...form,
        categories: form.categories.split(",").map((c) => c.trim()),
        imageUrl,
      };

      if (isNew) {
        await axios.post(`${API_URL}/api/products`, payload, { withCredentials: true });
      } else {
        await axios.put(`${API_URL}/api/products/${product._id}`, payload, { withCredentials: true });
      }

      onSave();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?._id) return;
    try {
      await axios.delete(`${API_URL}/api/products/${product._id}`, { withCredentials: true });
      onSave();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md max-h-[66vh] overflow-y-auto rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FaTimes className="text-2xl text-blue-900" />
        </button>

        <div className="mb-4 text-xl font-bold">{isNew ? "Añadir producto" : "Editar producto"}</div>

        <div className="w-full aspect-square bg-gray-200 rounded mb-4 relative">
          {form.imageUrl && !imageFile ? (
            <img src={form.imageUrl} alt="producto" className="w-full h-full object-cover rounded" />
          ) : null}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <FaCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-gray-500" />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Categorías</label>
            <input
              type="text"
              value={form.categories}
              onChange={(e) => handleChange("categories", e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1">Disponibilidad</label>
            <div className="flex gap-2">
              <button
                className={`flex-1 border px-3 py-1 rounded text-sm ${form.available ? "bg-blue-600 text-white" : ""}`}
                onClick={() => handleChange("available", true)}
              >
                Disponible
              </button>
              <button
                className={`flex-1 border px-3 py-1 rounded text-sm ${!form.available ? "bg-blue-600 text-white" : ""}`}
                onClick={() => handleChange("available", false)}
              >
                Oculto
              </button>
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <div className="flex items-center gap-2 justify-between">
              <button onClick={() => handleChange("quantity", Math.max(0, form.quantity - 1))} className="border px-2 rounded">
                <FaMinus />
              </button>
              <span>{form.quantity}</span>
              <button onClick={() => handleChange("quantity", form.quantity + 1)} className="border px-2 rounded">
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {!isNew && (
          <button
            onClick={handleDelete}
            className="w-full py-2 rounded bg-red-600 text-white font-bold mb-2 flex items-center justify-center gap-2 text-sm"
          >
            <FaTrash /> Eliminar
          </button>
        )}

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full py-2 rounded bg-[#002c66] text-white font-bold hover:bg-[#001a4d] text-sm"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}