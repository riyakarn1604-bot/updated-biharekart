import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mark review as helpful (increment count)
export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const review = await prisma.review.update({
      where: { id },
      data: { helpful: { increment: 1 } },
    });
    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
