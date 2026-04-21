import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

// Get all products with optional filters
export async function getProducts(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const lowStock = searchParams.get("lowStock") === "true";

  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };
  if (lowStock) query.stockQuantity = { $lt: 10 }; // threshold

  const products = await Product.find(query).sort({ name: 1 });
  return products;
}

// Create new product
export async function createProduct(data) {
  await dbConnect();
  const product = await Product.create(data);
  return product;
}

// Get single product
export async function getProductById(id) {
  await dbConnect();
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

// Update product
export async function updateProduct(id, data) {
  await dbConnect();
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new Error("Product not found");
  return product;
}

// Delete product
export async function deleteProduct(id) {
  await dbConnect();
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return product;
}

// Restock product (inventory update)
export async function restockProduct(id, quantity, userId) {
  await dbConnect();
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const previousStock = product.stockQuantity;
  product.stockQuantity += Number(quantity);
  await product.save();

  // Log inventory change
  await InventoryLog.create({
    product: id,
    changeType: "restock",
    quantityChange: quantity,
    previousStock,
    newStock: product.stockQuantity,
    reference: "Manual restock",
    performedBy: userId,
  });

  return product;
}
