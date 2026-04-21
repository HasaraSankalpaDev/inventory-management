import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Link from "next/link";

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
  const orderCount = todaySales.length;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {session.user.name}
        </h2>
        <p className="text-sm text-slate-500">
          Here is a quick overview of your sales performance for today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Today's Sales
          </h3>
          <p className="text-3xl font-bold text-slate-900">
            Rs. {totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Orders Processed
          </h3>
          <p className="text-3xl font-bold text-slate-900">{orderCount}</p>
        </div>

        {/* Call to Action Card */}
        <div className="bg-[#4988C4] p-6 rounded-2xl shadow-lg shadow-[#4988C4]/20 flex items-center justify-between">
          <div>
            <h3 className="text-white/80 font-medium mb-1">Ready to sell?</h3>
            <p className="text-white font-semibold">Start a new transaction</p>
          </div>
          <Link
            href="/cashier/pos"
            className="bg-white text-[#4988C4] px-5 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            POS Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
