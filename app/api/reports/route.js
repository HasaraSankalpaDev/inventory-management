import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as reportController from "@/controllers/reportController";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const date = searchParams.get("date");

  let result;
  switch (type) {
    case "daily":
      result = await reportController.getDailySales(
        date || new Date().toISOString().split("T")[0],
      );
      break;
    case "bestselling":
      result = await reportController.getBestSellingProducts(10);
      break;
    case "estimated":
      result = await reportController.getEstimatedRevenue();
      break;
    default:
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 },
      );
  }
  return NextResponse.json(result);
}
