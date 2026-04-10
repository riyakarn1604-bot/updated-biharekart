import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get seller dashboard data
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "overview";

    const sellerId = session.user.id;

    if (tab === "overview") {
      const products = await prisma.product.findMany({ where: { sellerId } });
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === "active").length;
      const totalInventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

      // Get orders containing this seller's products
      const orderItems = await prisma.orderItem.findMany({
        where: { product: { sellerId } },
        include: { order: true, product: true },
      });
      const totalOrders = new Set(orderItems.map(i => i.orderId)).size;
      const totalRevenue = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const pendingOrders = orderItems.filter(i => i.order.status !== "delivered").length;

      return NextResponse.json({
        totalProducts, activeProducts, totalInventoryValue,
        totalOrders, totalRevenue, pendingOrders,
      });
    }

    if (tab === "products") {
      const products = await prisma.product.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(products);
    }

    if (tab === "orders") {
      const orderItems = await prisma.orderItem.findMany({
        where: { product: { sellerId } },
        include: {
          order: { include: { address: true, user: true } },
          product: true,
        },
        orderBy: { order: { createdAt: "desc" } },
      });

      // Group by order
      const orderMap = new Map<string, unknown>();
      for (const item of orderItems) {
        if (!orderMap.has(item.orderId)) {
          orderMap.set(item.orderId, {
            ...item.order,
            items: [],
          });
        }
        (orderMap.get(item.orderId) as { items: unknown[] }).items.push(item);
      }
      return NextResponse.json(Array.from(orderMap.values()));
    }

    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
