import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = params;
    // Check if category is used in any product
    const category = await Category.findById(id);
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    const productsUsing = await Product.countDocuments({
      category: category.name,
    });
    if (productsUsing > 0) {
      return NextResponse.json(
        { error: `Cannot delete category used by ${productsUsing} product(s)` },
        { status: 400 },
      );
    }
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
