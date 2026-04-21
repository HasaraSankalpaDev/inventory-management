"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      const { data } = await axios.get("/api/products?lowStock=true");
      setLowStockProducts(data);
    };
    fetchLowStock();
  }, []);

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-bold mb-4 text-red-600">Low Stock Alert</h3>
      <ul className="divide-y">
        {lowStockProducts.map((product) => (
          <li key={product._id} className="py-2 flex justify-between">
            <span>{product.name}</span>
            <span className="font-medium">
              {product.stockQuantity} {product.unit}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/inventory"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        Restock →
      </Link>
    </div>
  );
}
