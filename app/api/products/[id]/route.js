import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as productController from "@/controllers/productController";

export async function GET(req, { params }) {
  // similar auth check
  const product = await productController.getProductById(params.id);
  return NextResponse.json(product);
}

export async function PUT(req, { params }) {
  // admin only
  const data = await req.json();
  const product = await productController.updateProduct(params.id, data);
  return NextResponse.json(product);
}

export async function DELETE(req, { params }) {
  // admin only
  await productController.deleteProduct(params.id);
  return NextResponse.json({ message: "Product deleted" });
}
