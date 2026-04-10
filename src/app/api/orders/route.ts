import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get user's orders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Place a new order
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, addressId, newAddress, paymentMode, total } = await req.json();

    // Create or use address
    let addrId = addressId;
    if (newAddress) {
      const addr = await prisma.address.create({
        data: { ...newAddress, userId: session.user.id },
      });
      addrId = addr.id;
    }

    // Create the order
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: addrId,
        total,
        paymentMode: paymentMode || "cod",
        status: "confirmed",
        estimatedDelivery,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } }, address: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
