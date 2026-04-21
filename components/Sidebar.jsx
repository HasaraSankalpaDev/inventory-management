"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/categories", label: "Categories" }, // <-- new
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/users", label: "Users" },
  { href: "/cashier/pos", label: "POS (Cashier)" },
];
export default function Sidebar({ role }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="p-6 text-xl font-bold text-slate-900 tracking-widest border-b border-slate-100">
        GROCERY<span className="text-[#4988C4]">MS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-[#4988C4] text-white shadow-md shadow-[#4988C4]/20"
                      : "hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-left py-2 px-4 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
