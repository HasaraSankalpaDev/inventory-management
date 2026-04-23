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
    <div style={styles.page}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cat-row:hover { background: #f8fafc; }
        .delete-btn:hover svg { color: #be123c !important; }
        .add-btn:hover { background: #3a75ad !important; }
        .cat-input:focus {
          border-color: #4988C4 !important;
          box-shadow: 0 0 0 3px rgba(73,136,196,0.12) !important;
        }
        @media (max-width: 640px) {
          .page-inner  { padding: 1.25rem !important; }
          .page-title  { font-size: 20px !important; }
          .form-row    { flex-direction: column !important; }
          .add-btn     { width: 100% !important; justify-content: center !important; }
          .col-created { display: none !important; }
          .th-created  { display: none !important; }
        }
      `}</style>

      <div className="page-inner" style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                stroke="#4988C4"
                strokeWidth="1.6"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={styles.title}>
              Manage Categories
            </h1>
            <p style={styles.subtitle}>Organize your inventory by category.</p>
          </div>
        </div>

        {/* Add Category Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.cardLabel}>Add New Category</p>
          </div>
          <div style={styles.divider} />

          {/* Success banner */}
          {message && (
            <div style={styles.successBanner}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#15803d"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 8l2 2 4-4"
                  stroke="#15803d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {message}
            </div>
          )}

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
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#be123c"
                  strokeWidth="1.5"
                />
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

          <form onSubmit={handleAdd}>
            <div className="form-row" style={styles.formRow}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Organic, Dairy, Snacks"
                className="cat-input"
                style={styles.input}
                required
              />
              <button type="submit" className="add-btn" style={styles.addBtn}>
                <Plus size={17} />
                Add Category
              </button>
            </div>
          </form>
        </div>

        {/* Categories Table Card */}
        <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem" }}>
            <div style={styles.cardHeader}>
              <p style={styles.cardLabel}>All Categories</p>
              {!loading && (
                <span style={styles.countBadge}>
                  {categories.length}{" "}
                  {categories.length === 1 ? "category" : "categories"}
                </span>
              )}
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Category</th>
                <th className="th-created" style={styles.th}>
                  Created
                </th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={styles.emptyCell}>
                    <div style={styles.spinner} />
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      Loading categories…
                    </span>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.emptyCell}>
                    <div style={styles.emptyIcon}>
                      <Tag size={22} color="#cbd5e1" />
                    </div>
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      No categories yet
                    </span>
                  </td>
                </tr>
              ) : (
                categories.map((cat, i) => (
                  <tr
                    key={cat._id}
                    className="cat-row"
                    style={{
                      ...styles.tr,
                      borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                      animation: "fadeSlideIn 0.2s ease",
                    }}
                  >
                    <td style={styles.td}>
                      <div style={styles.catName}>
                        <div style={styles.tagIcon}>
                          <Tag size={13} color="#4988C4" />
                        </div>
                        {cat.name}
                      </div>
                    </td>
                    <td
                      className="col-created"
                      style={{ ...styles.td, color: "#94a3b8", fontSize: 13 }}
                    >
                      {new Date(cat.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(cat._id, cat.name)}
                        style={styles.deleteBtn}
                        title={`Delete ${cat.name}`}
                      >
                        <Trash2 size={16} color="#cbd5e1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={styles.footerNote}>
          Categories in use cannot be deleted until their products are
          reassigned.
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
    maxWidth: 720,
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
  },

  /* Header */
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: "1.75rem",
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

  /* Cards */
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: "1.5rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
    marginBottom: "1.25rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    margin: 0,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#4988C4",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "3px 10px",
    borderRadius: 20,
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    marginBottom: "1.25rem",
  },

  /* Banners */
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: "1.25rem",
    animation: "fadeSlideIn 0.2s ease",
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

  /* Form */
  formRow: {
    display: "flex",
    gap: 12,
  },
  input: {
    flex: 1,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "11px 16px",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    transition: "border 0.15s, box-shadow 0.15s",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#4988C4",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },

  /* Table */
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
  },
  th: {
    padding: "12px 24px",
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    textAlign: "left",
  },
  tr: {
    transition: "background 0.12s",
  },
  td: {
    padding: "14px 24px",
    fontSize: 14,
    color: "#334155",
    fontWeight: 500,
  },
  catName: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  tagIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.12s",
  },

  /* Empty / loading */
  emptyCell: {
    padding: "3rem",
    textAlign: "center",
    display: "table-cell",
  },
  emptyIcon: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid #bfdbfe",
    borderTop: "2px solid #4988C4",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    margin: "0 auto 10px",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: "1rem",
  },
};
