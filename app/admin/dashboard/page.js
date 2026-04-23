// app/admin/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LowStockAlert from "@/components/LowStockAlert";
import SalesChart from "@/components/SalesChart";
import OrdersModal from "@/components/OrdersModal";

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 11l4-4 3 3 5-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 4h4v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect
      x="1.5"
      y="2.5"
      width="13"
      height="12"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M5 1v3M11 1v3M1.5 6.5h13"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 1h10v14l-2-1.5-2 1.5-2-1.5L5 15l-2-1.5V1z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function StatCard({ label, value, accent, badge, onClick, index }) {
  const accentMap = {
    blue: {
      bg: "#eef4fb",
      border: "#d4e5f5",
      iconBg: "#ddeefa",
      iconColor: "#4988C4",
      valueColor: "#1a2332",
    },
    green: {
      bg: "#f0faf5",
      border: "#c6ecd8",
      iconBg: "#d6f0e4",
      iconColor: "#2a9d5c",
      valueColor: "#1a4731",
    },
    indigo: {
      bg: "#f2f0fd",
      border: "#d8d4f8",
      iconBg: "#e3dffa",
      iconColor: "#5b52d6",
      valueColor: "#1a2332",
    },
  };
  const c = accentMap[accent] || accentMap.blue;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: `1px solid #e8edf3`,
        borderRadius: "14px",
        padding: "20px 22px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.18s ease",
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
      className="stat-card"
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = c.border;
          e.currentTarget.style.background = c.bg;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = "#e8edf3";
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: c.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: c.iconColor,
          }}
        >
          <TrendUpIcon />
        </div>

        {badge && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: "500",
              background: c.iconBg,
              color: c.iconColor,
              border: `1px solid ${c.border}`,
              borderRadius: "20px",
              padding: "3px 9px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {badge} <ArrowRightIcon />
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: "11px",
          fontWeight: "500",
          color: "#9ba8b8",
          letterSpacing: "0.04em",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "600",
          color: c.valueColor,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, profit: 0, orders: 0 });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/reports?type=daily&date=${selectedDate}`,
        );
        setStats({
          revenue: data.totalRevenue,
          profit: data.totalProfit,
          orders: data.orderCount,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedDate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        .dashboard-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card { animation: fadeUp 0.3s ease; }
        .section-card { animation: fadeUp 0.4s ease 0.15s both; }

        .date-input {
          appearance: none;
          background: #fff url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1.5' y='2.5' width='13' height='12' rx='1.5' stroke='%239ba8b8' stroke-width='1.3'/%3E%3Cpath d='M5 1v3M11 1v3M1.5 6.5h13' stroke='%239ba8b8' stroke-width='1.3' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat 10px center;
          padding: 8px 12px 8px 32px;
          border: 1px solid #e0e7ef;
          border-radius: 9px;
          font-size: 13px;
          color: #3a4558;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .date-input:focus { outline: none; border-color: #4988C4; box-shadow: 0 0 0 3px rgba(73,136,196,0.1); }
        .date-input:hover { border-color: #c5d3e0; }

        .divider { height: 1px; background: #f0f3f7; margin: 2px 0; }

        @media (max-width: 767px) {
          .dashboard-root { padding-top: 70px !important; }
        }
      `}</style>

      <div
        className="dashboard-root"
        style={{
          padding: "28px 24px",
          minHeight: "100vh",
          background: "#f7f9fc",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a2332",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Dashboard
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#9ba8b8",
                margin: "3px 0 0",
                fontWeight: "400",
              }}
            >
              {formatDate(selectedDate)}
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <StatCard
            index={0}
            label="Today's Revenue"
            value={loading ? "—" : `Rs. ${stats.revenue.toFixed(2)}`}
            accent="blue"
          />
          <StatCard
            index={1}
            label="Today's Profit"
            value={loading ? "—" : `Rs. ${stats.profit.toFixed(2)}`}
            accent="green"
          />
          <StatCard
            index={2}
            label="Orders Today"
            value={loading ? "—" : stats.orders}
            accent="indigo"
            badge="View all"
            onClick={() => setShowOrdersModal(true)}
          />
        </div>

        {/* Charts + Alerts */}
        <div
          className="section-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e8edf3",
              borderRadius: "14px",
              padding: "20px 22px",
              overflow: "hidden",
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
              Sales Overview
            </div>
            <SalesChart />
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e8edf3",
              borderRadius: "14px",
              padding: "20px 22px",
              overflow: "hidden",
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
              Low Stock Alerts
            </div>
            <LowStockAlert />
          </div>
        </div>
      </div>

      {showOrdersModal && (
        <OrdersModal
          date={selectedDate}
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </>
  );
}
