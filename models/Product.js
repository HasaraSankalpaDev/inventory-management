import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // ✅ No enum – accepts any string
    buyingPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, enum: ["kg", "g", "item", "liter"], required: true },
    barcode: { type: String, sparse: true, unique: true },
    expiryDate: { type: Date },
    image: { type: String },
  },
  { timestamps: true },
);

// Virtual for profit per unit
ProductSchema.virtual("profitPerUnit").get(function () {
  return this.sellingPrice - this.buyingPrice;
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
