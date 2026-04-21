import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function CashierLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧾</span>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Grocery POS
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-[#4988C4]"></div>
            <span className="text-sm font-medium text-slate-700">
              {session.user.name}
              <span className="text-slate-400 ml-1 uppercase text-[10px] font-bold">
                ({session.user.role})
              </span>
            </span>
          </div>
          <Link
            href="/api/auth/signout"
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
