"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import POSCart from "@/components/POSCart";

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M11 11l3 3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M16 10a4 4 0 01-8 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lock body scroll when mobile cart drawer is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = cartOpen ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (product) => {
    if (product.stockQuantity === 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      return existing
        ? prev.map((i) =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i._id !== id)
        : prev.map((i) => (i._id === id ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => setCart([]);

  const handleCheckout = async (paymentMethod) => {
    try {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      await axios.post("/api/sales", { items, paymentMethod });
      alert("Sale completed successfully!");
      clearCart();
      setCartOpen(false);
      fetchProducts();
    } catch (error) {
      alert(
        `❌ Checkout failed: ${error.response?.data?.error || error.message || "Checkout failed"}`,
      );
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawerUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .product-card {
          background: #fff;
          border: 1px solid #e8edf3;
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.18s ease;
          animation: fadeUp 0.3s ease both;
        }
        .product-card:hover {
          border-color: #c5d9ef;
          background: #eef4fb;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(73,136,196,0.08);
        }
        .product-card:active { transform: scale(0.97); }
        .product-card.out { opacity: 0.45; cursor: not-allowed; }
        .product-card.out:hover { transform: none; background: #fff; border-color: #e8edf3; box-shadow: none; }

        .search-input {
          width: 100%;
          background: #fff;
          border: 1px solid #e0e7ef;
          border-radius: 10px;
          padding: 10px 12px 10px 36px;
          font-size: 13px;
          color: #3a4558;
          font-family: inherit;
          font-weight: 400;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }
        .search-input:focus { border-color: #4988C4; box-shadow: 0 0 0 3px rgba(73,136,196,0.1); }
        .search-input::placeholder { color: #b0bbc9; }

        .grid-scroll::-webkit-scrollbar { width: 4px; }
        .grid-scroll::-webkit-scrollbar-track { background: transparent; }
        .grid-scroll::-webkit-scrollbar-thumb { background: #e0e7ef; border-radius: 4px; }

        /* Mobile cart FAB */
        .cart-fab {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 50;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #4988C4;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(73,136,196,0.35);
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cart-fab:active { transform: scale(0.94); }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e11d48;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #f8fafc;
        }

        /* Mobile drawer backdrop */
        .drawer-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.4);
          z-index: 55;
          animation: backdropIn 0.2s ease;
        }

        /* Mobile cart drawer */
        .cart-drawer {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 88vh;
          background: #fff;
          border-radius: 20px 20px 0 0;
          z-index: 60;
          overflow: hidden;
          box-shadow: 0 -8px 40px rgba(15,23,42,0.18);
          animation: drawerUp 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        /* Desktop sidebar */
        .cart-sidebar {
          display: flex;
          width: 320px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .pos-layout { flex-direction: column !important; gap: 0 !important; padding: 14px !important; }
          .products-panel { gap: 10px !important; }
          .grid-scroll { max-height: calc(100vh - 220px) !important; }
          .stats-bar { display: none !important; }
          .cart-sidebar { display: none !important; }
          .cart-fab { display: flex !important; }
          .drawer-backdrop.open { display: block !important; }
          .cart-drawer.open { display: flex !important; flex-direction: column; }
          .product-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important; }
        }
      `}</style>

      {/* Mobile cart backdrop */}
      <div
        className={`drawer-backdrop${cartOpen ? " open" : ""}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Mobile cart drawer */}
      <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                margin: "0 0 2px",
              }}
            >
              Cart
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "transparent",
              cursor: "pointer",
              fontSize: 14,
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <POSCart
            cart={cart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
            onCheckout={(pm) => {
              handleCheckout(pm);
            }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div
        className="pos-layout"
        style={{
          display: "flex",
          gap: 16,
          padding: 24,
          background: "#f7f9fc",
          minHeight: "calc(100vh - 60px)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Products panel */}
        <div
          className="products-panel"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 0,
          }}
        >
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ba8b8",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon />
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Stats bar — hidden on mobile */}
          <div className="stats-bar" style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Total", value: products.length },
              { label: "Showing", value: filteredProducts.length },
              { label: "In Cart", value: cartCount },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf3",
                  borderRadius: 9,
                  padding: "7px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#9ba8b8",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#1a2332" }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Product grid */}
          <div
            className="grid-scroll"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
              overflowY: "auto",
              flex: 1,
              maxHeight: "calc(100vh - 190px)",
              paddingRight: 4,
              alignContent: "start",
            }}
          >
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#b0bbc9",
                  fontSize: 13,
                }}
              >
                No products found for &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredProducts.map((product, i) => {
                const isOut = product.stockQuantity === 0;
                const isLow =
                  product.stockQuantity > 0 && product.stockQuantity <= 5;
                return (
                  <div
                    key={product._id}
                    className={`product-card${isOut ? " out" : ""}`}
                    style={{ animationDelay: `${i * 25}ms` }}
                    onClick={() => addToCart(product)}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a2332",
                        margin: "0 0 6px",
                        lineHeight: 1.4,
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#4988C4",
                        margin: "0 0 10px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Rs. {product.sellingPrice.toFixed(2)}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 20,
                          ...(isOut
                            ? {
                                background: "#fef0f0",
                                color: "#d94040",
                                border: "1px solid #fad4d4",
                              }
                            : isLow
                              ? {
                                  background: "#fff8ec",
                                  color: "#b07d1a",
                                  border: "1px solid #f5dfa0",
                                }
                              : {
                                  background: "#f0faf5",
                                  color: "#2a9d5c",
                                  border: "1px solid #c6ecd8",
                                }),
                        }}
                      >
                        {isOut
                          ? "Out of stock"
                          : `Stock: ${product.stockQuantity}`}
                      </span>
                      {!isOut && (
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            background: "#eef4fb",
                            border: "1px solid #d4e5f5",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#4988C4",
                            fontSize: 16,
                            lineHeight: 1,
                          }}
                        >
                          +
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desktop cart sidebar */}
        <div className="cart-sidebar">
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8edf3",
              borderRadius: 14,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <POSCart
              cart={cart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        className="cart-fab"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
      >
        <CartIcon />
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount > 9 ? "9+" : cartCount}</span>
        )}
      </button>
    </>
  );
}
