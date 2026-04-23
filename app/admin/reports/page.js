"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [daily, setDaily] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    fetchDailyReport();
    fetchBestSelling();
    fetchEstimatedRevenue();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    const { data } = await axios.get(
      `/api/reports?type=daily&date=${selectedDate}`,
    );
    setDaily(data);
  };

  const fetchBestSelling = async () => {
    const { data } = await axios.get("/api/reports?type=bestselling");
    setBestSelling(data);
  };

  const fetchEstimatedRevenue = async () => {
    const { data } = await axios.get("/api/reports?type=estimated");
    setEstimatedRevenue(data);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @media (max-width: 640px) {
          .page-inner    { padding: 1.25rem !important; }
          .page-title    { font-size: 20px !important; }
          .stats-grid    { grid-template-columns: 1fr !important; }
          .bottom-grid   { grid-template-columns: 1fr !important; }
          .stat-value    { font-size: 24px !important; }
          .inv-value     { font-size: 28px !important; }
        }
      `}</style>

      <div className="page-inner" style={styles.inner}>
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
                d="M7 17V13M11 17V9M15 17V11M19 17V7"
                stroke="#4988C4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={styles.title}>
              Reports & Analytics
            </h1>
            <p style={styles.subtitle}>
              Track revenue, profit, and inventory performance.
            </p>
          </div>
        </div>

        {/* Date Picker Card */}
        <div style={styles.dateCard}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <rect
              x="1.5"
              y="2.5"
              width="13"
              height="12"
              rx="2"
              stroke="#64748b"
              strokeWidth="1.4"
            />
            <path
              d="M5 1v3M11 1v3M1.5 6.5h13"
              stroke="#64748b"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span style={styles.dateLabel}>Report Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
          <div style={styles.livePill}>
            <div style={styles.liveDot} />
            <span style={styles.liveText}>Live data</span>
          </div>
        </div>

        {/* Daily Stats */}
        {daily && (
          <div className="stats-grid" style={styles.statsGrid}>
            {[
              {
                label: "Total Revenue",
                value: `Rs. ${daily.totalRevenue.toFixed(2)}`,
                blue: false,
                iconBg: "#eff6ff",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.31 14.71v1.28h-1.25v-1.3c-1.33-.3-2.43-1.12-2.5-2.62h1.41c.07.87.62 1.45 1.85 1.45 1.32 0 1.62-.66 1.62-1.08 0-.56-.3-1.1-1.84-1.5-1.72-.45-2.9-1.1-2.9-2.65 0-1.24.99-2.07 2.36-2.35V7h1.25v1.32c1.32.29 2.16 1.19 2.2 2.52h-1.39c-.04-.9-.52-1.45-1.57-1.45-1 0-1.6.49-1.6 1.18 0 .6.46.99 1.84 1.38 1.38.39 2.9.97 2.9 2.78 0 1.24-.93 2.07-2.38 2.38z"
                      fill="#4988C4"
                    />
                  </svg>
                ),
              },
              {
                label: "Total Profit",
                value: `Rs. ${daily.totalProfit.toFixed(2)}`,
                blue: true,
                iconBg: "#f0fdf4",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"
                      fill="#16a34a"
                    />
                  </svg>
                ),
              },
              {
                label: "Orders Placed",
                value: daily.orderCount,
                blue: false,
                iconBg: "#fef3c7",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"
                      fill="#d97706"
                    />
                  </svg>
                ),
              },
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <div
                  style={{ ...styles.statIconWrap, background: stat.iconBg }}
                >
                  {stat.icon}
                </div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p
                  className="stat-value"
                  style={{
                    ...styles.statValue,
                    ...(stat.blue ? styles.statBlue : {}),
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Grid */}
        <div className="bottom-grid" style={styles.bottomGrid}>
          {/* Best Selling */}
          <div style={styles.card}>
            <p style={styles.cardLabel}>Best Selling Products</p>
            <div style={styles.divider} />
            <ul style={styles.sellingList}>
              {bestSelling.map((item) => (
                <li key={item._id} style={styles.sellingItem}>
                  <span style={styles.sellingName}>{item.product.name}</span>
                  <span style={styles.sellingBadge}>
                    {item.totalQuantity} sold
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estimated Inventory Value */}
          <div style={{ ...styles.card, ...styles.invCard }}>
            <p style={styles.cardLabel}>Estimated Inventory Value</p>
            <div style={styles.divider} />
            <p className="inv-value" style={styles.invValue}>
              Rs. {estimatedRevenue.toFixed(2)}
            </p>
            <p style={styles.invNote}>
              Based on current stock and selling price.
            </p>
            <div style={styles.stockPill}>
              <div style={styles.stockDot} />
              Stock updated today
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={styles.footerNote}>
          Data refreshes automatically on date change.
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
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
  },
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

  /* Date picker */
  dateCard: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: "1rem 1.5rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
  },
  dateInput: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
  },
  livePill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginLeft: "auto",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4ade80",
    animation: "pulse 2s infinite",
  },
  liveText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#15803d",
  },

  /* Stats */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: "1.25rem 1.5rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
    animation: "fadeSlideIn 0.25s ease",
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  statBlue: {
    color: "#4988C4",
  },

  /* Shared card */
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: "1.5rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    margin: 0,
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "1rem 0",
  },

  /* Bottom grid */
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },

  /* Best selling */
  sellingList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  sellingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  sellingName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#334155",
  },
  sellingBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#4988C4",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "4px 12px",
    borderRadius: 20,
  },

  /* Inventory card */
  invCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  invValue: {
    fontSize: 36,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.8px",
    margin: "8px 0",
  },
  invNote: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  stockPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#15803d",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "4px 12px",
    borderRadius: 20,
    marginTop: 12,
    width: "fit-content",
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4ade80",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: "1.25rem",
  },
};
