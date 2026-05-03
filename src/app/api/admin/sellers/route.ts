import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellers = await prisma.sellerProfile.findMany({
      include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sellers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
