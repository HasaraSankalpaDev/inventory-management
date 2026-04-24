import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Link from "next/link";

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

export default async function CashierDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySales = await Sale.find({
    createdAt: { $gte: today, $lt: tomorrow },
    cashier: session.user.id,
  });

  const totalAmount = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = todaySales.reduce((sum, s) => sum + (s.profit ?? 0), 0);
  const orderCount = todaySales.length;

  const formatDate = () =>
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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

  const stats = [
    {
      label: "Today's Revenue",
      value: `Rs. ${totalAmount.toFixed(2)}`,
      accent: "blue",
      icon: <TrendUpIcon />,
    },
    {
      label: "Today's Profit",
      value: `Rs. ${totalProfit.toFixed(2)}`,
      accent: "green",
      icon: <TrendUpIcon />,
    },
    {
      label: "Orders Processed",
      value: orderCount,
      accent: "indigo",
      icon: <ReceiptIcon />,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .cashier-dash * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card { animation: fadeUp 0.3s ease both; }
        .section-card { animation: fadeUp 0.4s ease 0.15s both; }

        .recent-row:hover { background: #f7f9fc; }
      `}</style>

      <div
        className="cashier-dash"
        style={{
          padding: "28px 24px",
          minHeight: "100vh",
          background: "#f7f9fc",
          fontFamily: "'DM Sans', sans-serif",
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
            Welcome back, {session.user.name}
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#9ba8b8",
              margin: "3px 0 0",
              fontWeight: "400",
            }}
          >
            {formatDate()} — here's your shift at a glance
          </p>
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
          {stats.map(({ label, value, accent, icon }, i) => {
            const c = accentMap[accent];
            return (
              <div
                key={label}
                className="stat-card"
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf3",
                  borderRadius: "14px",
                  padding: "20px 22px",
                  animationDelay: `${i * 80}ms`,
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
                    {icon}
                  </div>
                </div>
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
          })}
        </div>

        {/* CTA + Recent Sales */}
        <div
          className="section-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "14px",
          }}
        >
          {/* POS CTA */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8edf3",
              borderRadius: "14px",
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "500",
                color: "#9ba8b8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Quick Actions
            </div>

            <Link
              href="/cashier/pos"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#4988C4",
                borderRadius: "11px",
                padding: "16px 18px",
                textDecoration: "none",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.7)",
                    margin: "0 0 3px",
                    fontWeight: "500",
                  }}
                >
                  Ready to sell?
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#fff",
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  Open POS Terminal
                </p>
              </div>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <ArrowRightIcon />
              </div>
            </Link>

            <div style={{ height: "1px", background: "#f0f3f7" }} />

            <div style={{ display: "flex", gap: "10px" }}>
              {[
                {
                  label: "Avg order value",
                  value:
                    orderCount > 0
                      ? `Rs. ${(totalAmount / orderCount).toFixed(2)}`
                      : "—",
                },
                {
                  label: "Shift total",
                  value: `Rs. ${totalAmount.toFixed(2)}`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    flex: 1,
                    background: "#f7f9fc",
                    border: "1px solid #e8edf3",
                    borderRadius: "9px",
                    padding: "12px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#9ba8b8",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      margin: "0 0 4px",
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a2332",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales */}
          <div
            style={{
              background: "#fff",
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
              Recent Orders
            </div>

            {todaySales.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#b0bbc9",
                  fontSize: "13px",
                }}
              >
                No orders yet today. Start selling!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {todaySales
                  .slice(-6)
                  .reverse()
                  .map((sale, i) => (
                    <div
                      key={sale._id}
                      className="recent-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 8px",
                        borderRadius: "8px",
                        borderBottom:
                          i < Math.min(todaySales.length, 6) - 1
                            ? "1px solid #f0f3f7"
                            : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            background: "#eef4fb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#4988C4",
                          }}
                        >
                          <ReceiptIcon />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#1a2332",
                              margin: 0,
                            }}
                          >
                            Order #{String(sale._id).slice(-5).toUpperCase()}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#9ba8b8",
                              margin: 0,
                            }}
                          >
                            {new Date(sale.createdAt).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#1a2332",
                            margin: 0,
                          }}
                        >
                          Rs. {sale.totalAmount.toFixed(2)}
                        </p>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "500",
                            background:
                              sale.paymentMethod === "Cash"
                                ? "#f0faf5"
                                : "#eef4fb",
                            color:
                              sale.paymentMethod === "Cash"
                                ? "#2a9d5c"
                                : "#4988C4",
                            border: `1px solid ${sale.paymentMethod === "Cash" ? "#c6ecd8" : "#d4e5f5"}`,
                            borderRadius: "20px",
                            padding: "1px 7px",
                          }}
                        >
                          {sale.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
