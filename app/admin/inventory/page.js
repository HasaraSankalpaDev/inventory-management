"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockProductId, setRestockProductId] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
      setMessageType("success");
      setRestockProductId("");
      setRestockQuantity("");
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || "Restock failed");
      setMessageType("error");
    }
  };

  const getStockStatus = (qty) => {
    if (qty <= 5)
      return {
        label: "Low",
        bg: "#fff0f0",
        color: "#d94f4f",
        border: "#fad4d4",
      };
    if (qty <= 20)
      return {
        label: "Mid",
        bg: "#fff8ec",
        color: "#b07a1a",
        border: "#f5dfa0",
      };
    return { label: "OK", bg: "#f0faf5", color: "#2a9d5c", border: "#c6ecd8" };
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "low" && p.stockQuantity <= 5) ||
      (filter === "ok" && p.stockQuantity > 5);
    return matchSearch && matchFilter;
  });

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      iconBg: "#ddeefa",
      iconColor: "#4988C4",
    },
    {
      label: "Low Stock Items",
      value: products.filter((p) => p.stockQuantity <= 5).length,
      iconBg: "#fad4d4",
      iconColor: "#d94f4f",
    },
    {
      label: "Total Units",
      value: products.reduce((a, p) => a + p.stockQuantity, 0),
      iconBg: "#d6f0e4",
      iconColor: "#2a9d5c",
    },
    {
      label: "Categories",
      value: new Set(products.map((p) => p.category)).size,
      iconBg: "#e3dffa",
      iconColor: "#5b52d6",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f9fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#9ba8b8",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading inventory…
        </span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .inv-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .inv-card { animation: fadeUp 0.3s ease both; }
        .inv-stat:hover { border-color: #d4e5f5 !important; background: #eef4fb !important; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.05) !important; }
        .inv-row:hover td { background: #f7f9fc; }
        .inv-select, .inv-input {
          appearance: none;
          height: 36px;
          border: 1px solid #e0e7ef;
          border-radius: 9px;
          padding: 0 12px;
          font-size: 13px;
          color: #3a4558;
          font-weight: 500;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
          outline: none;
        }
        .inv-select:focus, .inv-input:focus { border-color: #4988C4; box-shadow: 0 0 0 3px rgba(73,136,196,0.1); }
        .inv-select:hover, .inv-input:hover { border-color: #c5d3e0; }
        .inv-pill {
          height: 28px;
          padding: 0 12px;
          border-radius: 20px;
          border: 1px solid #e0e7ef;
          background: #fff;
          font-size: 12px;
          font-weight: 500;
          color: #9ba8b8;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .inv-pill:hover { border-color: #c5d3e0; color: #3a4558; }
        .inv-pill.active { background: #eef4fb; color: #4988C4; border-color: #d4e5f5; }
        .inv-search {
          height: 34px;
          border: 1px solid #e0e7ef;
          border-radius: 9px;
          padding: 0 12px;
          font-size: 13px;
          color: #3a4558;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s;
          flex: 1;
          min-width: 160px;
        }
        .inv-search:focus { border-color: #4988C4; box-shadow: 0 0 0 3px rgba(73,136,196,0.1); }
        @media (max-width: 640px) {
          .inv-root { padding: 16px !important; padding-top: 72px !important; }
          .inv-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .inv-form-row { flex-direction: column !important; }
          .inv-form-row .inv-select,
          .inv-form-row .inv-input,
          .inv-form-row .inv-btn { width: 100% !important; }
          .inv-table th:nth-child(2),
          .inv-table td:nth-child(2) { display: none; }
        }
      `}</style>

      <div
        className="inv-root"
        style={{
          padding: "28px 24px",
          minHeight: "100vh",
          background: "#f7f9fc",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a2332",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Inventory
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#9ba8b8",
              margin: "3px 0 0",
              fontWeight: "400",
            }}
          >
            Manage and restock product levels
          </p>
        </div>

        {/* Stat Cards */}
        <div
          className="inv-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="inv-card inv-stat"
              style={{
                background: "#fff",
                border: "1px solid #e8edf3",
                borderRadius: "14px",
                padding: "18px 20px",
                animationDelay: `${i * 70}ms`,
                transition: "all 0.18s ease",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="5"
                    width="14"
                    height="10"
                    rx="1.5"
                    stroke={s.iconColor}
                    strokeWidth="1.3"
                  />
                  <path
                    d="M5 5V3.5A3 3 0 0111 3.5V5"
                    stroke={s.iconColor}
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "#9ba8b8",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "600",
                  color: "#1a2332",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Restock Form */}
        <div
          className="inv-card"
          style={{
            background: "#fff",
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            padding: "20px 22px",
            marginBottom: "14px",
            animationDelay: "200ms",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: "#9ba8b8",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Restock Product
          </div>

          {message && (
            <div
              style={{
                marginBottom: "14px",
                padding: "10px 14px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "500",
                background: messageType === "success" ? "#f0faf5" : "#fff0f0",
                color: messageType === "success" ? "#2a9d5c" : "#d94f4f",
                border: `1px solid ${messageType === "success" ? "#c6ecd8" : "#fad4d4"}`,
              }}
            >
              {message}
            </div>
          )}

          <div
            className="inv-form-row"
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "160px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "#9ba8b8",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Product
              </div>
              <select
                value={restockProductId}
                onChange={(e) => setRestockProductId(e.target.value)}
                required
                className="inv-select"
                style={{ width: "100%" }}
              >
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.stockQuantity} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: "100px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "#9ba8b8",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Qty
              </div>
              <input
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="0"
                className="inv-input"
                style={{ width: "100%" }}
              />
            </div>

            <button
              className="inv-btn"
              onClick={handleRestock}
              style={{
                height: "36px",
                padding: "0 20px",
                background: "#4988C4",
                color: "#fff",
                border: "none",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#3a75ad")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#4988C4")
              }
            >
              Update Stock
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div
          className="inv-card"
          style={{
            background: "#fff",
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            overflow: "hidden",
            animationDelay: "280ms",
          }}
        >
          {/* Search + Filters */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f0f3f7",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="inv-search"
            />
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { key: "all", label: "All" },
                { key: "low", label: "Low stock" },
                { key: "ok", label: "In stock" },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`inv-pill ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              className="inv-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f3f7" }}>
                  {[
                    "Product",
                    "Category",
                    "Current Stock",
                    "Unit",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 20px",
                        fontSize: "11px",
                        fontWeight: "500",
                        color: "#9ba8b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#9ba8b8",
                      }}
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const status = getStockStatus(p.stockQuantity);
                    return (
                      <tr
                        key={p._id}
                        className="inv-row"
                        style={{
                          borderBottom: "1px solid #f0f3f7",
                          transition: "background 0.12s",
                        }}
                      >
                        <td
                          style={{
                            padding: "13px 20px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#1a2332",
                          }}
                        >
                          {p.name}
                        </td>
                        <td
                          style={{
                            padding: "13px 20px",
                            fontSize: "13px",
                            color: "#9ba8b8",
                          }}
                        >
                          {p.category}
                        </td>
                        <td
                          style={{
                            padding: "13px 20px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#1a2332",
                          }}
                        >
                          {p.stockQuantity}
                        </td>
                        <td
                          style={{
                            padding: "13px 20px",
                            fontSize: "13px",
                            color: "#9ba8b8",
                          }}
                        >
                          {p.unit}
                        </td>
                        <td style={{ padding: "13px 20px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: "500",
                              background: status.bg,
                              color: status.color,
                              border: `1px solid ${status.border}`,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
