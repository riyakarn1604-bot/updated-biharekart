import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// Submit a new review
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { productId, userName, rating, title, body, images } = data;

    if (!productId || !userName || !rating || !title || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userName,
        rating: Number(rating),
        title,
        body,
        images: images ? JSON.stringify(images) : null,
        verified: false,
      },
    });

    // Update product review count and recalculate average rating
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviews: allReviews.length,
        rating: Math.round(avgRating * 10) / 10,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
