"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react"; // Ensure you have lucide-react installed
import POSCart from "@/components/POSCart";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) setCart(cart.filter((item) => item._id !== id));
    else
      setCart(
        cart.map((item) => (item._id === id ? { ...item, quantity } : item)),
      );
  };

  const clearCart = () => setCart([]);

  const handleCheckout = async (paymentMethod) => {
    try {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      const res = await axios.post("/api/sales", { items, paymentMethod });
      alert("Sale completed successfully!");
      clearCart();
      // Refresh products to show updated stock
      fetchProducts();
    } catch (error) {
      // Show detailed error
      const errorMsg =
        error.response?.data?.error || error.message || "Checkout failed";
      alert(`❌ Checkout failed: ${errorMsg}`);
      console.error("Checkout error:", error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-8 bg-slate-50 min-h-screen">
      {/* Product Selection Grid */}
      <div className="flex-1">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(100vh-160px)] overflow-y-auto pr-2">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#4988C4] hover:shadow-md cursor-pointer transition-all group"
            >
              <p className="font-semibold text-slate-900 group-hover:text-[#4988C4] transition-colors">
                {product.name}
              </p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                Rs. {product.sellingPrice.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Stock: {product.stockQuantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
          <POSCart
            cart={cart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
