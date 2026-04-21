"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockProductId, setRestockProductId] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
    setLoading(false);
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockProductId || !restockQuantity) return;
    try {
      await axios.post("/api/inventory", {
        productId: restockProductId,
        quantity: parseInt(restockQuantity),
      });
      setMessage("Stock updated successfully");
      setRestockProductId("");
      setRestockQuantity("");
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || "Restock failed");
    }
  };

  if (loading)
    return <div className="p-8 text-slate-500">Loading inventory...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-slate-900 mb-8">
        Inventory Management
      </h2>

      {/* Restock Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Restock Product
        </h3>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleRestock} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Product
            </label>
            <select
              value={restockProductId}
              onChange={(e) => setRestockProductId(e.target.value)}
              required
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-all outline-none"
            >
              <option value="">-- Select a product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Current: {p.stockQuantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              required
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[#4988C4] hover:bg-[#3a75ad] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#4988C4]/20"
          >
            Update
          </button>
        </form>
      </div>

      {/* Current Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              {["Product", "Category", "Current Stock", "Unit"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {p.category}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {p.stockQuantity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{p.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
