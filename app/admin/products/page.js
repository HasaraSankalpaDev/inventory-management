"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    }
  };

  if (loading)
    return <div className="p-8 text-slate-500">Loading inventory...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your inventory stock
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="bg-[#4988C4] hover:bg-[#3a75ad] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md shadow-[#4988C4]/20"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {[
                  "Name",
                  "Category",
                  "Buy Price",
                  "Sell Price",
                  "Stock",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    Rs. {product.buyingPrice}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    Rs. {product.sellingPrice}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-slate-900">
                      {product.stockQuantity}
                    </span>
                    <span className="text-slate-400 ml-1">{product.unit}</span>
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-[#4988C4] hover:text-[#3a75ad] text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
