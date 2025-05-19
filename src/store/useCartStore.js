import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find((p) => p._id === item._id);
      if (existing) {
        // si ya existe, sumamos la cantidad
        return {
          cartItems: state.cartItems.map((p) =>
            p._id === item._id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          ),
        };
      } else {
        return { cartItems: [...state.cartItems, item] };
      }
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item._id !== id),
    })),

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;