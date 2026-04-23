import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

// ✅ GET /api/sales – Fetch sales with optional date filter
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sales = await Sale.find(query)
      .populate("items.product", "name")
      .populate("cashier", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("GET /api/sales error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST /api/sales – Create a new sale
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { items, paymentMethod } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Generate invoice number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await Sale.countDocuments({
      createdAt: { $gte: new Date(date.setHours(0, 0, 0, 0)) },
    });
    const invoiceNumber = `INV-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;

    const saleItems = [];
    let totalAmount = 0;
    let totalProfit = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 },
        );
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          },
          { status: 400 },
        );
      }

      const previousStock = product.stockQuantity;
      product.stockQuantity -= item.quantity;
      await product.save();

      await InventoryLog.create({
        product: product._id,
        changeType: "sale",
        quantityChange: -item.quantity,
        previousStock,
        newStock: product.stockQuantity,
        reference: invoiceNumber,
        performedBy: session.user.id,
      });

      const priceAtSale = product.sellingPrice;
      const costAtSale = product.buyingPrice;
      const itemTotal = priceAtSale * item.quantity;
      const itemProfit = (priceAtSale - costAtSale) * item.quantity;

      saleItems.push({
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
      items: saleItems,
      totalAmount,
      totalProfit,
      paymentMethod: paymentMethod || "Cash",
      cashier: session.user.id,
    });

    return NextResponse.json(
      { message: "Sale completed", sale },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/sales error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
