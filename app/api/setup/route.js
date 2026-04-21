// app/api/setup/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json(
        {
          error:
            "Admin already exists. Setup endpoint is disabled for security.",
        },
        { status: 403 },
      );
    }

    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      {
        message:
          "✅ Admin user created successfully! DELETE this API route after use.",
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
