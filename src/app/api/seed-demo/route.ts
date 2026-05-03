import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const accounts = [
      { email: "admin@demo.com", name: "Demo Admin", role: "admin", password: "admin123" },
      { email: "seller@demo.com", name: "Demo Seller", role: "seller", password: "seller123" },
      { email: "user@demo.com", name: "Demo Customer", role: "customer", password: "user123" },
    ];

    const results = [];
    for (const acc of accounts) {
      const hashed = await bcrypt.hash(acc.password, 10);
      const user = await prisma.user.upsert({
        where: { email: acc.email },
        update: { password: hashed, role: acc.role, name: acc.name },
        create: {
          email: acc.email,
          name: acc.name,
          role: acc.role,
          password: hashed,
        },
      });
      results.push({ email: user.email, role: user.role, name: user.name });
    }

    return NextResponse.json({
      success: true,
      message: "Demo accounts created!",
      accounts: results,
      credentials: [
        { role: "Admin",    email: "admin@demo.com",  password: "admin123" },
        { role: "Seller",   email: "seller@demo.com", password: "seller123" },
        { role: "Customer", email: "user@demo.com",   password: "user123" },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
