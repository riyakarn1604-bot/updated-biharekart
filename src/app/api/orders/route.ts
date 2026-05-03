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
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, addressId, newAddress, paymentMode } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
    }

    if (paymentMode !== "cod" && paymentMode !== "online") {
      return NextResponse.json({ error: "Invalid payment mode" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 50) {
        return NextResponse.json({ error: "Invalid item quantity or product ID" }, { status: 400 });
      }
    }

    const orderResult = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        await tx.product.update({
          where: { id: product.id },
          data: { 
            stock: product.stock - item.quantity, 
            inStock: (product.stock - item.quantity) > 0 
          }
        });

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      let addrId = addressId;
      if (newAddress) {
        const addr = await tx.address.create({
          data: { ...newAddress, userId },
        });
        addrId = addr.id;
      }

      if (!addrId) {
        throw new Error("Shipping address is required");
      }

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      return tx.order.create({
        data: {
          userId,
          addressId: addrId,
          total,
          paymentMode,
          status: "confirmed",
          estimatedDelivery,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: { include: { product: true } }, address: true },
      });
    });

    return NextResponse.json(orderResult);
  } catch (error: any) {
    console.error(error);
    if (error.message && error.message.includes("Insufficient stock")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status: 500 });
  }
}
