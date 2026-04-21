import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["restock", "sale", "adjustment"],
      required: true,
    },
    quantityChange: { type: Number, required: true }, // positive for restock, negative for sale
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reference: { type: String }, // e.g., invoice number or "manual restock"
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.InventoryLog ||
  mongoose.model("InventoryLog", InventoryLogSchema);
