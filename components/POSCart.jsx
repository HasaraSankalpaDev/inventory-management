// components/POSCart.jsx
"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function POSCart({
  cart,
  updateQuantity,
  clearCart,
  onCheckout,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );

  const handleQuantityChange = (id, value) => {
    const newQty = parseInt(value) || 0;
    updateQuantity(id, newQty);
  };

  const handleIncrement = (id, currentQty) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrement = (id, currentQty) => {
    if (currentQty > 0) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleCheckoutClick = () => {
    if (paymentMethod === "Card") {
      setShowCardModal(true);
    } else {
      onCheckout(paymentMethod);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowCardModal(false);
      onCheckout("Card");
      setCardDetails({ number: "", expiry: "", cvv: "" });
    }, 1500);
  };

  return (
    <>
      <div className="flex flex-col h-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Current Bill
        </h3>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm">No items in cart</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Rs. {item.sellingPrice.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity controls with +/- and input */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDecrement(item._id, item.quantity)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#4988C4] transition"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      className="w-14 text-center text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 px-1 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4]"
                      style={{ color: "#1e293b" }} // Explicit dark text color
                    />
                    <button
                      onClick={() => handleIncrement(item._id, item.quantity)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#4988C4] transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="w-20 text-right text-sm font-semibold text-slate-900">
                    Rs. {(item.sellingPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  Rs. {total.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#4988C4] transition-all"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCart}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="bg-[#4988C4] hover:bg-[#3a75ad] text-white py-3 rounded-xl text-sm font-medium transition-all shadow-md shadow-[#4988C4]/20"
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card Payment Demo Modal (unchanged) */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCardModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-lg font-bold text-slate-900">Card Payment</h4>
              <button
                onClick={() => setShowCardModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCardSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4988C4] text-slate-900"
                    required
                    maxLength="19"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiry: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4988C4] text-slate-900"
                      required
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4988C4] text-slate-900"
                      required
                      maxLength="3"
                    />
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700">
                    ⚠️ This is a demo. No real transaction will be processed.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-[#4988C4] hover:bg-[#3a75ad] text-white py-3 rounded-xl text-sm font-medium transition-all shadow-md shadow-[#4988C4]/20 disabled:opacity-50"
                >
                  {processing ? "Processing..." : `Pay Rs. ${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
