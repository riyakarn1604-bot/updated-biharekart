import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get addresses for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const addresses = await prisma.address.findMany({ where: { userId: session.user.id } });
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
