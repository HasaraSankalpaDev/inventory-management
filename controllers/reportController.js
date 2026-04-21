import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Product from "@/models/Product";

// Daily sales summary
export async function getDailySales(date) {
  await dbConnect();
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } });
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  const orderCount = sales.length;

  return { totalRevenue, totalProfit, orderCount, sales };
}

// Weekly sales summary
export async function getWeeklySales(weekStart) {
  // Similar logic with date range of 7 days
  // ...
}

// Monthly revenue
export async function getMonthlyRevenue(month, year) {
  // ...
}

// Best selling products
export async function getBestSellingProducts(limit = 10) {
  await dbConnect();
  const pipeline = [
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.priceAtSale"] },
        },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        "product.name": 1,
      },
    },
  ];
  return await Sale.aggregate(pipeline);
}

// Low stock products (already in product controller)

// Estimated revenue (future projection based on current stock * selling price)
export async function getEstimatedRevenue() {
  await dbConnect();
  const products = await Product.find();
  return products.reduce((sum, p) => sum + p.stockQuantity * p.sellingPrice, 0);
}
