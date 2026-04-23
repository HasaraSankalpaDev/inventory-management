"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
      setDeletingId(id);
      await axios.delete(`/api/products/${id}`);
      await fetchProducts();
      setDeletingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStock = products.filter((p) => p.stockQuantity <= 5).length;

  if (loading)
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading inventory…</p>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Inventory</h1>
          <p style={styles.subtitle}>
            {products.length} product{products.length !== 1 ? "s" : ""}
            {lowStock > 0 && (
              <span style={styles.lowStockBadge}>{lowStock} low stock</span>
            )}
          </p>
        </div>
        <Link href="/admin/products/add" style={styles.addBtn}>
          <span style={styles.plusIcon}>+</span>
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <svg style={styles.searchIcon} viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.5" />
          <path
            d="M15 15l-3-3"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search products or categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        {search && (
          <button onClick={() => setSearch("")} style={styles.clearBtn}>
            ✕
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: "Total Products", value: products.length },
          {
            label: "Total Stock",
            value: products
              .reduce((a, p) => a + (p.stockQuantity || 0), 0)
              .toLocaleString(),
          },
          {
            label: "Avg. Margin",
            value: products.length
              ? Math.round(
                  products.reduce(
                    (a, p) =>
                      a +
                      ((p.sellingPrice - p.buyingPrice) / p.sellingPrice) * 100,
                    0,
                  ) / products.length,
                ) + "%"
              : "—",
          },
          { label: "Low Stock", value: lowStock, danger: true },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              ...styles.statCard,
              ...(s.danger && lowStock > 0 ? styles.statCardDanger : {}),
            }}
          >
            <p style={styles.statLabel}>{s.label}</p>
            <p
              style={{
                ...styles.statValue,
                ...(s.danger && lowStock > 0 ? styles.statValueDanger : {}),
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                "Name",
                "Category",
                "Buy Price",
                "Sell Price",
                "Stock",
                "Actions",
              ].map((h) => (
                <th key={h} style={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.empty}>
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isLow = product.stockQuantity <= 5;
                return (
                  <tr key={product._id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.productName}>{product.name}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.categoryPill}>
                        {product.category}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.price}>
                        Rs. {product.buyingPrice?.toLocaleString()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.price, fontWeight: 600 }}>
                        Rs. {product.sellingPrice?.toLocaleString()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.stockBadge,
                          ...(isLow
                            ? styles.stockBadgeLow
                            : styles.stockBadgeOk),
                        }}
                      >
                        {product.stockQuantity} {product.unit}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          style={styles.editBtn}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          style={styles.deleteBtn}
                        >
                          {deletingId === product._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div style={styles.mobileList}>
        {filtered.length === 0 ? (
          <div style={styles.mobileEmpty}>No products found.</div>
        ) : (
          filtered.map((product) => {
            const isLow = product.stockQuantity <= 5;
            return (
              <div key={product._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.cardName}>{product.name}</p>
                    <span style={styles.categoryPill}>{product.category}</span>
                  </div>
                  <span
                    style={{
                      ...styles.stockBadge,
                      ...(isLow ? styles.stockBadgeLow : styles.stockBadgeOk),
                    }}
                  >
                    {product.stockQuantity} {product.unit}
                  </span>
                </div>
                <div style={styles.cardPrices}>
                  <div style={styles.priceBox}>
                    <p style={styles.priceLabel}>Buy</p>
                    <p style={styles.priceValue}>
                      Rs. {product.buyingPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div style={styles.priceDivider} />
                  <div style={styles.priceBox}>
                    <p style={styles.priceLabel}>Sell</p>
                    <p style={{ ...styles.priceValue, color: "#4988C4" }}>
                      Rs. {product.sellingPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div style={styles.priceDivider} />
                  <div style={styles.priceBox}>
                    <p style={styles.priceLabel}>Margin</p>
                    <p style={{ ...styles.priceValue, color: "#16a34a" }}>
                      {product.sellingPrice
                        ? Math.round(
                            ((product.sellingPrice - product.buyingPrice) /
                              product.sellingPrice) *
                              100,
                          ) + "%"
                        : "—"}
                    </p>
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    style={styles.cardEditBtn}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                    style={styles.cardDeleteBtn}
                  >
                    {deletingId === product._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-list { display: flex !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .page-pad { padding: 1.25rem !important; }
        }
        @media (min-width: 769px) {
          .mobile-list { display: none !important; }
          .desktop-table { display: block !important; }
        }
        tr:hover td { background: #f8fafc; }
        .edit-btn:hover { background: #eff6ff; color: #1d4ed8 !important; }
        .delete-btn:hover { background: #fff1f2; color: #be123c !important; }
        input::placeholder { color: #94a3b8; }
        input:focus { outline: none; box-shadow: 0 0 0 3px rgba(73,136,196,0.15); border-color: #4988C4 !important; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    padding: "2rem",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "1rem",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #4988C4",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#64748b", fontSize: 14, margin: 0 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  lowStockBadge: {
    background: "#fff1f2",
    color: "#be123c",
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 20,
    border: "1px solid #fecdd3",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#4988C4",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
  plusIcon: { fontSize: 18, lineHeight: 1 },
  searchWrap: {
    position: "relative",
    marginBottom: "1.25rem",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
  },
  searchInput: {
    width: "100%",
    padding: "10px 36px 10px 38px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: 14,
    color: "#0f172a",
    boxSizing: "border-box",
    transition: "border 0.15s, box-shadow 0.15s",
  },
  clearBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: 13,
    padding: "2px 4px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: "1.25rem",
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
  },
  statCardDanger: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    margin: "0 0 4px 0",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  statValueDanger: { color: "#be123c" },
  tableWrap: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 20px",
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    background: "#f8fafc",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "left",
  },
  tr: { transition: "background 0.1s" },
  td: {
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    verticalAlign: "middle",
  },
  productName: { fontWeight: 600, color: "#0f172a" },
  categoryPill: {
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 12,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 20,
    display: "inline-block",
  },
  price: { color: "#334155", fontSize: 14 },
  stockBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
  },
  stockBadgeOk: {
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
  },
  stockBadgeLow: {
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #fecdd3",
  },
  actions: { display: "flex", gap: 8 },
  editBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#4988C4",
    background: "#eff6ff",
    textDecoration: "none",
    border: "1px solid #bfdbfe",
    transition: "all 0.15s",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#e11d48",
    background: "transparent",
    border: "1px solid #fecdd3",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "48px 0",
    fontSize: 14,
  },
  // Mobile cards
  mobileList: {
    display: "none",
    flexDirection: "column",
    gap: 12,
  },
  mobileEmpty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "48px 0",
    fontSize: 14,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
    gap: 12,
  },
  cardName: {
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px 0",
    fontSize: 15,
  },
  cardPrices: {
    display: "flex",
    borderBottom: "1px solid #f1f5f9",
  },
  priceBox: {
    flex: 1,
    padding: "12px 16px",
    textAlign: "center",
  },
  priceDivider: { width: 1, background: "#f1f5f9" },
  priceLabel: {
    fontSize: 11,
    color: "#94a3b8",
    margin: "0 0 4px 0",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  priceValue: { fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 },
  cardActions: {
    display: "flex",
    padding: "12px 16px",
    gap: 10,
  },
  cardEditBtn: {
    flex: 1,
    textAlign: "center",
    padding: "9px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: "#4988C4",
    background: "#eff6ff",
    textDecoration: "none",
    border: "1px solid #bfdbfe",
  },
  cardDeleteBtn: {
    flex: 1,
    padding: "9px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: "#e11d48",
    background: "transparent",
    border: "1px solid #fecdd3",
    cursor: "pointer",
  },
};
