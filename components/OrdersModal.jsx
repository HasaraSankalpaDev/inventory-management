// components/OrdersModal.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersModal({ date, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/sales", {
          params: { start: date, end: date },
        });
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [date]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalRevenue = orders.reduce((a, o) => a + (o.totalAmount || 0), 0);
  const totalProfit = orders.reduce((a, o) => a + (o.totalProfit || 0), 0);

  return (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .order-row:hover { background: #f8fafc; }
        .close-btn:hover { background: #f1f5f9; color: #334155 !important; }
        @media (max-width: 600px) {
          .orders-modal { width: calc(100vw - 24px) !important; max-height: 90vh !important; top: auto !important; bottom: 12px !important; left: 12px !important; transform: none !important; border-radius: 20px 20px 16px 16px !important; animation: none !important; }
          .detail-modal { width: calc(100vw - 24px) !important; max-height: 92vh !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.45)",
          zIndex: 40,
          animation: "backdropIn 0.2s ease",
        }}
      />

      {/* Main Modal */}
      <div
        className="orders-modal"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 640,
          maxHeight: "82vh",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modalSlideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 16px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  margin: "0 0 4px",
                }}
              >
                Daily Orders
              </p>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {formattedDate}
              </h3>
            </div>
            <button
              className="close-btn"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "transparent",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Summary pills */}
          {!loading && orders.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: `${orders.length} order${orders.length !== 1 ? "s" : ""}`,
                  color: "#475569",
                  bg: "#f1f5f9",
                  border: "#e2e8f0",
                },
                {
                  label: `Rs. ${totalRevenue.toFixed(2)} revenue`,
                  color: "#1d4ed8",
                  bg: "#eff6ff",
                  border: "#bfdbfe",
                },
                {
                  label: `Rs. ${totalProfit.toFixed(2)} profit`,
                  color: "#15803d",
                  bg: "#f0fdf4",
                  border: "#bbf7d0",
                },
              ].map((p) => (
                <span
                  key={p.label}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 20,
                    color: p.color,
                    background: p.bg,
                    border: `1px solid ${p.border}`,
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "12px 16px 16px", flex: 1 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 0",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #4988C4",
                  borderRadius: "50%",
                  animation: "spin 0.75s linear infinite",
                }}
              />
              <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                Fetching orders…
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#334155",
                  margin: "0 0 4px",
                }}
              >
                No orders
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                There are no orders recorded for this date.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="order-row"
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          margin: "0 0 3px",
                          fontSize: 14,
                        }}
                      >
                        {order.invoiceNumber}
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          margin: "0 0 3px",
                          fontSize: 15,
                        }}
                      >
                        Rs. {order.totalAmount.toFixed(2)}
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={tagStyle("#f1f5f9", "#475569", "#e2e8f0")}>
                      {order.cashier?.name || "Unknown"}
                    </span>
                    <span style={tagStyle("#eff6ff", "#1d4ed8", "#bfdbfe")}>
                      {order.paymentMethod}
                    </span>
                    {order.totalProfit != null && (
                      <span style={tagStyle("#f0fdf4", "#15803d", "#bbf7d0")}>
                        +Rs. {order.totalProfit.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

function tagStyle(bg, color, border) {
  return {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    background: bg,
    color,
    border: `1px solid ${border}`,
    display: "inline-block",
  };
}

function OrderDetailModal({ order, onClose }) {
  const margin = order.totalAmount
    ? Math.round((order.totalProfit / order.totalAmount) * 100)
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes detailIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .detail-close:hover { background: #f1f5f9 !important; color: #334155 !important; }
        .item-row:hover td { background: #f8fafc; }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.3)",
        }}
      />

      <div
        className="detail-modal"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(15,23,42,0.22)",
          width: "100%",
          maxWidth: 520,
          maxHeight: "84vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "detailIn 0.2s cubic-bezier(0.16,1,0.3,1)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 16px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  margin: "0 0 3px",
                }}
              >
                Invoice
              </p>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {order.invoiceNumber}
              </h4>
            </div>
            <button
              className="detail-close"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "transparent",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px 20px" }}>
          {/* Meta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "Date & Time",
                value: new Date(order.createdAt).toLocaleString(),
              },
              { label: "Cashier", value: order.cashier?.name || "Unknown" },
              { label: "Payment", value: order.paymentMethod },
              {
                label: "Items",
                value: `${order.items?.length || 0} item${order.items?.length !== 1 ? "s" : ""}`,
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    margin: "0 0 3px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Items table */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Product", "Qty", "Price", "Total"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textAlign: i === 0 ? "left" : "right",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="item-row"
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        fontWeight: 500,
                        color: "#334155",
                      }}
                    >
                      {item.product?.name || "Product"}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        color: "#64748b",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        color: "#64748b",
                      }}
                    >
                      Rs. {item.priceAtSale.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      Rs. {(item.quantity * item.priceAtSale).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div
            style={{
              marginTop: 12,
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #f1f5f9",
              overflow: "hidden",
            }}
          >
            {[
              {
                label: "Subtotal",
                value: `Rs. ${order.totalAmount.toFixed(2)}`,
                color: "#0f172a",
                bold: false,
              },
              {
                label: "Profit",
                value: `Rs. ${order.totalProfit.toFixed(2)}`,
                color: "#15803d",
                bold: false,
              },
              {
                label: "Margin",
                value: `${margin}%`,
                color: "#1d4ed8",
                bold: false,
              },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 16px",
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <span
                  style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}
                >
                  {row.label}
                </span>
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: row.color }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
