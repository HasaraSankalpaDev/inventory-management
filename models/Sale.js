import mongoose from "mongoose";

const SaleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  priceAtSale: { type: Number, required: true }, // selling price at time of sale
  costAtSale: { type: Number, required: true }, // buying price at time of sale (for profit)
});

const SaleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    items: [SaleItemSchema],
    totalAmount: { type: Number, required: true },
    totalProfit: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Other"],
      default: "Cash",
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
