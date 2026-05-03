import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get all products (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const sellerId = searchParams.get("sellerId");

    const where: any = { status: "active" };

    if (sellerId) {
      const session = await auth();
      if (session?.user?.id === sellerId || (session?.user as any)?.role === "admin") {
        delete where.status; // allow all statuses for seller's own products or admin
      }
      where.sellerId = sellerId;
    } else {
      // For public browsing: only show products from approved sellers or demo seller
      where.OR = [
        { seller: { sellerProfile: { status: "approved" } } },
        { sellerId: "demo-seller" }
      ];
    }

    if (category && category !== "All") where.category = category;
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { vendor: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check seller is approved (unless admin or demo)
    if (role === "seller" && session.user.id !== "demo-seller") {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!sellerProfile || sellerProfile.status !== "approved") {
        return NextResponse.json({ error: "Seller account not approved yet. Please wait for admin approval." }, { status: 403 });
      }
    }

    const data = await req.json();

    if (!data.name || !data.description || data.price === undefined || !data.category || data.stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let images = "[]";
    try { images = JSON.stringify(Array.isArray(data.images) ? data.images : JSON.parse(data.images || "[]")); } catch {}
    
    let highlights = "[]";
    try { highlights = JSON.stringify(Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || "[]")); } catch {}
    
    let details = "{}";
    try { details = JSON.stringify(typeof data.details === "object" && data.details !== null ? data.details : JSON.parse(data.details || "{}")); } catch {}

    const product = await prisma.product.create({
      data: {
        name: String(data.name),
        description: String(data.description),
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: String(data.category),
        stock: Number(data.stock),
        image: data.image ? String(data.image) : undefined,
        images,
        videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
        highlights,
        details,
        brandDescription: data.brandDescription ? String(data.brandDescription) : undefined,
        
        sellerId: session.user.id,
        rating: 0,
        reviews: 0,
        status: role === "admin" && data.status ? data.status : "draft",
        vendor: session.user.name || "Unknown Vendor",
        inStock: Number(data.stock) > 0,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
