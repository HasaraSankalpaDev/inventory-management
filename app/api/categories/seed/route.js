import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

const defaultCategories = [
  "Fresh Produce",
  "Rice & Staples",
  "Dry Food",
  "Cooking Essentials",
  "Dairy",
  "Meat & Seafood",
  "Frozen",
  "Snacks",
  "Beverages",
  "Household",
  "Personal Care",
  "Baby Products",
];

export async function POST() {
  await dbConnect();
  try {
    for (const name of defaultCategories) {
      await Category.findOneAndUpdate({ name }, { name }, { upsert: true });
    }
    return NextResponse.json({ message: "Default categories seeded" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
