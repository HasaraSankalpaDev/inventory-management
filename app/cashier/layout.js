import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function CashierLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={styles.root}>
      <style>{`
        @media (max-width: 600px) {
          .header-inner { padding: 0 1rem !important; }
          .brand-text   { display: none !important; }
          .user-name    { display: none !important; }
          .logout-text  { display: none !important; }
          .logout-icon  { display: flex !important; }
        }
        .logout-btn:hover { background: #fff1f2 !important; border-color: #fecdd3 !important; color: #be123c !important; }
        .logout-btn:hover .logout-icon-svg { stroke: #be123c !important; }
      `}</style>

      <header style={styles.header}>
        <div className="header-inner" style={styles.headerInner}>
          {/* Brand */}
          <Link href="/cashier" style={styles.brand}>
            <div style={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="14"
                  rx="3"
                  stroke="#4988C4"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 7V5a4 4 0 00-8 0v2"
                  stroke="#4988C4"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M9 13h6M9 17h4"
                  stroke="#4988C4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="brand-text" style={styles.brandText}>
              Grocery POS
            </span>
          </Link>

          {/* Right side */}
          <div style={styles.right}>
            {/* Online indicator */}
            <div style={styles.onlinePill}>
              <span style={styles.onlineDot} />
              <span style={styles.onlineLabel}>Live</span>
            </div>

            {/* User chip */}
            <div style={styles.userChip}>
              <div style={styles.avatar}>{initials}</div>
              <div className="user-name" style={styles.userInfo}>
                <span style={styles.userName}>{session.user.name}</span>
                <span style={styles.userRole}>{session.user.role}</span>
              </div>
            </div>

            {/* Logout */}
            <Link
              href="/api/auth/signout"
              className="logout-btn"
              style={styles.logoutBtn}
              title="Sign out"
            >
              {/* Icon always visible */}
              <svg
                className="logout-icon-svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                style={{ stroke: "#e11d48", flexShrink: 0 }}
              >
                <path
                  d="M16 17l5-5-5-5M21 12H9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="logout-text" style={styles.logoutText}>
                Sign out
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
    position: "sticky",
    top: 0,
    zIndex: 30,
  },
  headerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 2rem",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    flexShrink: 0,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  onlinePill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 20,
    padding: "5px 11px",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16a34a",
    boxShadow: "0 0 0 2px #dcfce7",
    display: "inline-block",
  },
  onlineLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#15803d",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "6px 12px 6px 6px",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "linear-gradient(135deg, #4988C4, #3a75ad)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    letterSpacing: "0.5px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: 10,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 13px",
    borderRadius: 10,
    border: "1px solid #fecdd3",
    background: "transparent",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#e11d48",
  },
  main: {
    maxWidth: 1280,
    margin: "0 auto",
  },
};
