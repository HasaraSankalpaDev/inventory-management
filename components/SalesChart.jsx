"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);

        const { data: sales } = await axios.get("/api/sales", {
          params: {
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
          },
        });

        const dailyTotals = {};
        sales.forEach((sale) => {
          const date = new Date(sale.createdAt).toISOString().split("T")[0];
          dailyTotals[date] = (dailyTotals[date] || 0) + sale.totalAmount;
        });

        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          chartData.push({
            date: dateStr.slice(5),
            revenue: dailyTotals[dateStr] || 0,
          });
        }

        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch sales chart data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const avg = data.length ? Math.round(total / data.length) : 0;
  const peak = data.length
    ? data.reduce((a, b) => (b.revenue > a.revenue ? b : a))
    : null;

  const stats = [
    {
      label: "Total revenue",
      value:
        total >= 1000 ? `Rs. ${(total / 1000).toFixed(1)}k` : `Rs. ${total}`,
    },
    {
      label: "Daily avg",
      value: `Rs. ${avg.toLocaleString()}`,
    },
    {
      label: "Peak day",
      value: peak?.date ?? "—",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 antialiased font-sans">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="h-4 w-28 bg-slate-100 rounded-md animate-pulse mb-2" />
            <div className="h-3 w-20 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>

        <div className="h-48 flex items-end gap-2 px-1">
          {[50, 70, 45, 80, 60, 90, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-slate-100 rounded-t-lg animate-pulse"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="border-t border-slate-100 my-5" />

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3">
              <div className="h-3 w-16 bg-slate-100 rounded animate-pulse mb-2" />
              <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 antialiased font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-900 tracking-tight">
            Sales Revenue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
        </div>
        <span className="text-xs font-medium bg-[#EBF2F9] text-[#185FA5] px-3 py-1 rounded-full">
          Weekly
        </span>
      </div>

      {/* Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={28}
            margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
              }
            />
            <Tooltip
              formatter={(value) => [
                `Rs. ${value.toLocaleString()}`,
                "Revenue",
              ]}
              labelStyle={{ color: "#64748b", fontSize: 11 }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "0 4px 16px rgba(73,136,196,0.10)",
                color: "#0f172a",
              }}
              cursor={{ fill: "#f8fafc", radius: 4 }}
            />
            <Bar
              dataKey="revenue"
              fill="#4988C4"
              radius={[6, 6, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-5" />

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900 tracking-tight">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <div className="w-2.5 h-2.5 rounded-sm bg-[#4988C4]" />
        <span className="text-xs text-slate-400">Revenue (Rs.)</span>
      </div>
    </div>
  );
}
