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
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-slate-900 mb-8">
        Reports & Analytics
      </h2>

      {/* Date Picker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-center gap-4 max-w-sm">
        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] outline-none transition-all"
        />
      </div>

      {/* Daily Summary */}
      {daily && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Revenue",
              val: `Rs. ${daily.totalRevenue.toFixed(2)}`,
              color: "text-slate-900",
            },
            {
              label: "Total Profit",
              val: `Rs. ${daily.totalProfit.toFixed(2)}`,
              color: "text-[#4988C4]",
            },
            {
              label: "Orders Placed",
              val: daily.orderCount,
              color: "text-slate-900",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {stat.label}
              </h3>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Secondary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
            Best Selling Products
          </h3>
          <ul className="space-y-4">
            {bestSelling.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700">
                  {item.product.name}
                </span>
                <span className="text-sm font-semibold text-[#4988C4] bg-[#4988C4]/10 px-3 py-1 rounded-full">
                  {item.totalQuantity} sold
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Estimated Value */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
            Estimated Inventory Value
          </h3>
          <p className="text-4xl font-bold text-slate-900 mb-2">
            Rs. {estimatedRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">
            Based on current stock and selling price.
          </p>
        </div>
      </div>
    </div>
  );
}
