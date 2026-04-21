// app/api/sales/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { items, paymentMethod } = await req.json();

    // Validate items
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

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 },
        );
      }

      // Check stock
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          },
          { status: 400 },
        );
      }

      // Update stock
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

    // Create sale record
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
    console.error("Sale creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
