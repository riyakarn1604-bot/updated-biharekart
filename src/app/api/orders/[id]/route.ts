import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get single order with full details
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, address: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Update order status (seller/admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    const now = new Date();
    
    const statusUpdate: Record<string, unknown> = { status };
    if (status === "packed") statusUpdate.packedAt = now;
    if (status === "shipped") statusUpdate.shippedAt = now;
    if (status === "out_for_delivery") statusUpdate.outForDeliveryAt = now;
    if (status === "delivered") statusUpdate.deliveredAt = now;

    const order = await prisma.order.update({
      where: { id },
      data: statusUpdate,
      include: { items: { include: { product: true } }, address: true },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
