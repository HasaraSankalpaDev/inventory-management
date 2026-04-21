"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${params.id}`);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      await axios.put(`/api/products/${params.id}`, formData);
      router.push("/admin/products");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update product.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-medium">
        Loading product data...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 bg-white border border-slate-200 rounded-xl hover:text-[#4988C4] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Product</h2>
            <p className="text-sm text-slate-500">
              Modify the details for {product?.name || "this item"}.
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  );
}
