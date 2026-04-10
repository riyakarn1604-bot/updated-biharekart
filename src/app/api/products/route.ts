import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all products (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const sellerId = searchParams.get("sellerId");

    const where: Record<string, unknown> = { status: "active" };
    if (category && category !== "All") where.category = category;
    if (sellerId) { where.sellerId = sellerId; delete where.status; }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { vendor: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({ where, orderBy });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Create a new product (seller)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({ data });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
