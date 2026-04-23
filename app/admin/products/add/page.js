"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
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
    <div style={styles.page}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .page-inner { padding: 1.25rem !important; }
          .form-card  { padding: 1.25rem !important; border-radius: 14px !important; }
          .page-title { font-size: 22px !important; }
        }
      `}</style>

      <div className="page-inner" style={styles.inner}>
        {/* Back link */}
        <Link href="/admin/products" style={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke="#64748b"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Inventory
        </Link>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="#4988C4"
                strokeWidth="1.8"
              />
              <path
                d="M12 8v8M8 12h8"
                stroke="#4988C4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={styles.title}>
              Add New Product
            </h1>
            <p style={styles.subtitle}>
              Fill in the details to add a product to your inventory.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <circle cx="8" cy="8" r="7" stroke="#be123c" strokeWidth="1.5" />
              <path
                d="M8 5v4M8 11v.5"
                stroke="#be123c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form card */}
        <div className="form-card" style={styles.card}>
          {/* Progress hint */}
          <div style={styles.cardHeader}>
            <p style={styles.cardLabel}>Product Details</p>
            {loading && (
              <div style={styles.savingPill}>
                <div style={styles.miniSpinner} />
                Saving…
              </div>
            )}
          </div>

          <div style={styles.divider} />

          <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Footer note */}
        <p style={styles.footerNote}>
          Product will be immediately available in your inventory after saving.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  inner: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#64748b",
    textDecoration: "none",
    fontWeight: 500,
    marginBottom: "1.75rem",
    padding: "6px 12px 6px 8px",
    borderRadius: 8,
    background: "#fff",
    border: "1px solid #e2e8f0",
    transition: "background 0.15s",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: "1.5rem",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 3px 0",
    letterSpacing: "-0.4px",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: "1.25rem",
    animation: "fadeSlideIn 0.2s ease",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: "1.75rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    margin: 0,
  },
  savingPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#4988C4",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "4px 12px",
    borderRadius: 20,
  },
  miniSpinner: {
    width: 12,
    height: 12,
    border: "2px solid #bfdbfe",
    borderTop: "2px solid #4988C4",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    marginBottom: "1.5rem",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: "1.25rem",
  },
};
