"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🛒</span>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-black/50 dark:text-white/50 mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deliveryCharge = totalPrice >= 500 ? 0 : 49;
  const grandTotal = totalPrice + deliveryCharge;

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 border border-black/5 dark:border-white/5 rounded-2xl">
                <div className={`w-24 h-24 rounded-xl ${item.product.image} flex-shrink-0 flex items-center justify-center`}>
                  <span className="text-2xl opacity-30">{
                    item.product.category === "Mithila Art" ? "🎨" :
                    item.product.category === "Handlooms" ? "🧵" :
                    item.product.category === "Spices" ? "🌶️" :
                    item.product.category === "Sweets" ? "🍬" :
                    item.product.category === "Handicrafts" ? "🏺" : "📱"
                  }</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">{item.product.name}</Link>
                  <p className="text-xs text-black/50 dark:text-white/50">{item.product.vendor}</p>
                  <p className="font-bold mt-1">₹{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden text-sm">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 hover:bg-black/5 dark:hover:bg-white/5">−</button>
                      <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 hover:bg-black/5 dark:hover:bg-white/5">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                  </div>
                </div>
                <div className="font-bold text-right">₹{(item.product.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-black/60 dark:text-white/60">Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-black/60 dark:text-white/60">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <hr className="my-4 border-black/5 dark:border-white/5" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full mt-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="block text-center text-sm text-primary mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
