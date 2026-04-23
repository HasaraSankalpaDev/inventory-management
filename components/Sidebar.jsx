"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const adminLinks = [
  {
    section: "Overview",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              fill="currentColor"
            />
            <rect
              x="9"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              fill="currentColor"
              opacity=".4"
            />
            <rect
              x="1"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              fill="currentColor"
              opacity=".4"
            />
            <rect
              x="9"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              fill="currentColor"
              opacity=".4"
            />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Catalogue",
    items: [
      {
        href: "/admin/products",
        label: "Products",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 3h12M2 8h8M2 13h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="5"
              width="14"
              height="10"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 5V3.5a3 3 0 0 1 6 0V5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        ),
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 3h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 7h6M5 10h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        href: "/admin/reports",
        label: "Reports",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 12l3.5-4 3 3 3-5.5L14 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="5"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M2 13c0-3 2.686-5 6-5s6 2 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        href: "/cashier/pos",
        label: "POS (Cashier)",
        pos: true,
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect
              x="2"
              y="2"
              width="12"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 14h6M8 11v3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
];

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 5l3 3-3 3M13 8H6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 4.5h12M3 9h12M3 13.5h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

export default function Sidebar({ role = "Admin" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <aside
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        borderRight: "1px solid #e8edf3",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid #f0f3f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "0.16em",
              color: "#1a2332",
            }}
          >
            GROCERY
            <span style={{ color: "#4988C4" }}>MS</span>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#9ba8b8",
              letterSpacing: "0.06em",
              marginTop: "2px",
            }}
          >
            Management System
          </div>
        </div>

        {/* Role badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "#eef4fb",
            border: "1px solid #d4e5f5",
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "11px",
            color: "#4988C4",
            fontWeight: "500",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#4988C4",
              display: "inline-block",
            }}
          />
          {role}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {adminLinks.map((group) => (
          <div key={group.section} style={{ marginBottom: "4px" }}>
            <div
              style={{
                fontSize: "9px",
                fontWeight: "600",
                letterSpacing: "0.12em",
                color: "#b8c4d0",
                padding: "10px 10px 5px",
                textTransform: "uppercase",
              }}
            >
              {group.section}
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {group.items.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: isActive ? "500" : "400",
                        color: isActive
                          ? "#4988C4"
                          : link.pos
                            ? "#6b7a8d"
                            : "#4a5568",
                        background: isActive
                          ? "#eef4fb"
                          : link.pos
                            ? "#f8fafb"
                            : "transparent",
                        border: isActive
                          ? "1px solid #d4e5f5"
                          : link.pos
                            ? "1px dashed #dde4ed"
                            : "1px solid transparent",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                        marginBottom: "1px",
                      }}
                    >
                      <span
                        style={{
                          color: isActive
                            ? "#4988C4"
                            : link.pos
                              ? "#9ba8b8"
                              : "#9ba8b8",
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {link.icon}
                      </span>
                      {link.label}
                      {link.pos && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "9px",
                            background: "#eef4fb",
                            color: "#4988C4",
                            border: "1px solid #d4e5f5",
                            borderRadius: "4px",
                            padding: "1px 5px",
                            fontWeight: "500",
                          }}
                        >
                          POS
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid #f0f3f7",
        }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#9ba8b8",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff5f5";
            e.currentTarget.style.color = "#e53e3e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#9ba8b8";
          }}
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop sidebar (≥768px) ── */}
      <div
        className="sidebar-desktop"
        style={{ width: "220px", minWidth: "220px", minHeight: "100vh" }}
      >
        <SidebarContent />
      </div>

      {/* ── Mobile topbar + drawer (< 768px) ── */}
      <div className="sidebar-mobile">
        {/* Top bar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            height: "54px",
            background: "#ffffff",
            borderBottom: "1px solid #e8edf3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontFamily: "'DM Sans', 'Outfit', sans-serif",
          }}
        >
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4a5568",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Toggle menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>

          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "0.14em",
              color: "#1a2332",
            }}
          >
            GROCERY<span style={{ color: "#4988C4" }}>MS</span>
          </div>

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#eef4fb",
              border: "1px solid #d4e5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              color: "#4988C4",
              fontWeight: "600",
            }}
          >
            AD
          </div>
        </div>

        {/* Overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "rgba(15, 22, 35, 0.35)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Drawer */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            width: "260px",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.26s cubic-bezier(.4,0,.2,1)",
            boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <SidebarContent />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .sidebar-desktop { display: flex; }
        .sidebar-mobile  { display: none; }

        @media (max-width: 767px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile  { display: block; }
        }
      `}</style>
    </>
  );
}
