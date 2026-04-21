import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

// Create a sale (POS transaction)
export async function createSale(data, userId) {
  await dbConnect();

  // Generate invoice number (e.g., INV-YYYYMMDD-XXXX)
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Sale.countDocuments({
    createdAt: { $gte: new Date(date.setHours(0, 0, 0, 0)) },
  });
  const invoiceNumber = `INV-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;

  // Validate stock and update products
  const items = [];
  let totalAmount = 0;
  let totalProfit = 0;

  for (const item of data.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Update product stock
    const previousStock = product.stockQuantity;
    product.stockQuantity -= item.quantity;
    await product.save();

    // Log inventory change
    await InventoryLog.create({
      product: product._id,
      changeType: "sale",
      quantityChange: -item.quantity,
      previousStock,
      newStock: product.stockQuantity,
      reference: invoiceNumber,
      performedBy: userId,
    });

    const priceAtSale = product.sellingPrice;
    const costAtSale = product.buyingPrice;
    const itemTotal = priceAtSale * item.quantity;
    const itemProfit = (priceAtSale - costAtSale) * item.quantity;

    items.push({
      product: product._id,
      quantity: item.quantity,
      priceAtSale,
      costAtSale,
    });

    totalAmount += itemTotal;
    totalProfit += itemProfit;
  }

  const sale = await Sale.create({
    invoiceNumber,
    items,
    totalAmount,
    totalProfit,
    paymentMethod: data.paymentMethod || "Cash",
    cashier: userId,
  });

  return sale;
}

// Get sales with optional date filters
export async function getSales(startDate, endDate) {
  await dbConnect();
  let query = {};
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  const sales = await Sale.find(query)
    .populate("items.product", "name")
    .populate("cashier", "name email")
    .sort({ createdAt: -1 });
  return sales;
}
