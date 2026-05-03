import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Register a new user
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
    }

    // Check if exists
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    if (phone) {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing) return NextResponse.json({ error: "Phone already registered" }, { status: 400 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        name: name || `User-${Date.now().toString(36)}`,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        role: role || "customer",
      },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

// Get current user profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Handle demo accounts without database record
    if (session.user.id.startsWith("demo-")) {
      return NextResponse.json({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role,
        sellerProfile: (session.user as any).role === "seller" || (session.user as any).role === "admin" ? {
          status: "approved",
          shopName: "Bihar Bazaar Demo Store",
          description: "Authentic products from the heart of Bihar."
        } : null
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { sellerProfile: true },
    });
    
    if (user) {
      // Remove sensitive fields
      const { password, ...safeUser } = user as any;
      return NextResponse.json(safeUser);
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (err) {
    console.error("User API error:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
