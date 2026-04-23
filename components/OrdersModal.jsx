// components/OrdersModal.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersModal({ date, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/sales", {
          params: { start: date, end: date },
        });
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [date]);

  // Close detail modal
  const handleCloseDetail = () => setSelectedOrder(null);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-xl z-50 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">
            Orders for {new Date(date).toLocaleDateString()}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <p className="text-center text-slate-500 py-8">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No orders found for this date.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">
                        {order.invoiceNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        Rs. {order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Cashier: {order.cashier?.name || "Unknown"} •{" "}
                    {order.paymentMethod}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseDetail} />
      )}
    </>
  );
}

// Inner component for order details
function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h4 className="font-bold text-slate-800">Order Details</h4>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="mb-4">
            <p className="text-sm text-slate-500">Invoice Number</p>
            <p className="font-medium">{order.invoiceNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Date & Time</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cashier</p>
              <p className="font-medium">{order.cashier?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Payment Method</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Items</p>
              <p className="font-medium">{order.items?.length || 0}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h5 className="font-medium text-slate-700 mb-2">Items</h5>
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b">
                <tr>
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-2">{item.product?.name || "Product"}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      Rs. {item.priceAtSale.toFixed(2)}
                    </td>
                    <td className="text-right py-2 font-medium">
                      Rs. {(item.quantity * item.priceAtSale).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan="3" className="text-right py-3">
                    Total :
                  </td>
                  <td className="text-right py-3">
                    Rs. {order.totalAmount.toFixed(2)}
                  </td>
                </tr>
                <tr className="text-green-600 text-sm">
                  <td colSpan="3" className="text-right">
                    Profit:
                  </td>
                  <td className="text-right">
                    Rs. {order.totalProfit.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
