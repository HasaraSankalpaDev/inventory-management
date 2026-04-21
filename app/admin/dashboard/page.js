// app/admin/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LowStockAlert from "@/components/LowStockAlert";
import SalesChart from "@/components/SalesChart";
import OrdersModal from "@/components/OrdersModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, profit: 0, orders: 0 });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
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
      }
    };
    fetchStats();
  }, [selectedDate]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">
            Today's Revenue
          </h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            Rs. {stats.revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Today's Profit</h3>
          <p className="text-3xl font-bold text-green-600 mt-1">
            Rs. {stats.profit.toFixed(2)}
          </p>
        </div>
        {/* Clickable Orders Card */}
        <div
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition"
          onClick={() => setShowOrdersModal(true)}
        >
          <h3 className="text-slate-500 text-sm font-medium flex items-center gap-2">
            Orders Today
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              click to view
            </span>
          </h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {stats.orders}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <LowStockAlert />
      </div>

      {/* Orders Modal */}
      {showOrdersModal && (
        <OrdersModal
          date={selectedDate}
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </div>
  );
}
