import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, shopName, description, businessAddress, taxId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "seller" ? "seller" : "customer",
      },
    });

    // Create pending SellerProfile if registering as seller
    if (role === "seller") {
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          shopName: shopName || name,
          description: description || null,
          gstNumber: businessAddress || null, // Mapping businessAddress to gstNumber for now
          bankAccount: taxId || null,         // Mapping taxId to bankAccount for now
          status: "pending",
        },
      });
    }

    return NextResponse.json({ message: "User created successfully", user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 });
  }
}
