// components/ProductForm.jsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const UNITS = ["kg", "g", "item", "liter"];

export default function ProductForm({ initialData = {}, onSubmit, loading }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    category: initialData.category || "",
    buyingPrice: initialData.buyingPrice || "",
    sellingPrice: initialData.sellingPrice || "",
    stockQuantity: initialData.stockQuantity || 0,
    unit: initialData.unit || UNITS[0],
    barcode: initialData.barcode || "",
    expiryDate: initialData.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : "",
    image: initialData.image || "",
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        const categoryNames = data.map((c) => c.name);
        setCategories(categoryNames);

        // If editing and category is set, keep it; otherwise set first available
        if (!formData.category && categoryNames.length > 0) {
          setFormData((prev) => ({ ...prev, category: categoryNames[0] }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to a default list if API fails
        setCategories([
          "Fresh Produce",
          "Rice & Staples",
          "Dry Food",
          "Cooking Essentials",
          "Dairy",
          "Meat & Seafood",
          "Frozen",
          "Snacks",
          "Beverages",
          "Household",
          "Personal Care",
          "Baby Products",
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      buyingPrice: parseFloat(formData.buyingPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stockQuantity: parseInt(formData.stockQuantity),
    };
    onSubmit(payload);
  };

  // Shared classes for consistent input styling
  const inputClass =
    "w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-all duration-200";
  const labelClass =
    "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className={labelClass}>Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Category & Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Category *</label>
          {categoriesLoading ? (
            <select className={inputClass} disabled>
              <option>Loading categories...</option>
            </select>
          ) : categories.length === 0 ? (
            <div>
              <select className={inputClass} disabled>
                <option>No categories available</option>
              </select>
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Please{" "}
                <a
                  href="/admin/categories"
                  className="text-[#4988C4] hover:underline font-medium"
                >
                  add a category
                </a>{" "}
                first.
              </p>
            </div>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className={labelClass}>Unit *</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className={inputClass}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Buying Price (Rs.) *</label>
          <input
            type="number"
            name="buyingPrice"
            value={formData.buyingPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Selling Price (Rs.) *</label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Stock & Barcode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Initial Stock *</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Barcode</label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Expiry & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#4988C4] hover:bg-[#3a75ad] text-white px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md shadow-[#4988C4]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving Product..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
