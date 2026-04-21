"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Tag } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError("");
    setMessage("");
    try {
      await axios.post("/api/categories", { name: newCategory.trim() });
      setMessage(`Category "${newCategory}" added successfully`);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add category");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
      setMessage(`Category "${name}" removed`);
    } catch (err) {
      setError(err.response?.data?.error || "Cannot delete this category");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Manage Categories</h2>
        <p className="text-sm text-slate-500 mt-1">
          Organize your inventory by category.
        </p>
      </div>

      {/* Add Category Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 max-w-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Add New Category
        </h3>
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Organic, Dairy, Snacks"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] outline-none transition-all"
            required
          />
          <button
            type="submit"
            className="bg-[#4988C4] hover:bg-[#3a75ad] text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-500">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-4 text-sm font-medium text-slate-900 flex items-center gap-3">
                    <Tag size={16} className="text-slate-400" /> {cat.name}
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
