"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/products", formData);
      router.push("/admin/products");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Add New Product
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Create a new product listing to manage your inventory.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="max-w-3xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
