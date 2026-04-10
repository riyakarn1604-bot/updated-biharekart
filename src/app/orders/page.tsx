"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Suspense } from "react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const successId = searchParams.get("success");
  const { orders, user } = useAuth();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Please login to view orders</h1>
        <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
      {successId && (
        <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-2xl text-center">
          <span className="text-4xl mb-3 block">🎉</span>
          <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-1">Order Placed Successfully!</h2>
          <p className="text-green-600 dark:text-green-400">Order ID: <span className="font-mono font-bold">{successId}</span></p>
          <Link href="/shop" className="inline-block mt-4 text-primary hover:underline font-medium">Continue Shopping</Link>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-black/40 dark:text-white/40">
          <p className="text-xl mb-2">No orders yet</p>
          <Link href="/shop" className="text-primary hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{order.id}</p>
                  <p className="text-sm text-black/50 dark:text-white/50">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`mt-2 sm:mt-0 inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === "Processing" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : order.status === "Shipped" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-black/60 dark:text-white/60">{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <hr className="my-3 border-black/5 dark:border-white/5" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-black/40 dark:text-white/40 mt-2">
                Delivering to: {order.address.street}, {order.address.city} - {order.address.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">Loading...</div>}>
        <OrdersContent />
      </Suspense>
      <Footer />
    </div>
  );
}
