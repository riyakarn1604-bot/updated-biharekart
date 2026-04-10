"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === Number(params.id));
  if (!product) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/shop" className="text-primary hover:underline">Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <Link href="/shop" className="text-sm text-primary hover:underline mb-6 inline-block">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className={`w-full aspect-square rounded-2xl ${product.image} flex items-center justify-center`}>
            <span className="text-8xl opacity-30">{
              product.category === "Mithila Art" ? "🎨" :
              product.category === "Handlooms" ? "🧵" :
              product.category === "Spices" ? "🌶️" :
              product.category === "Sweets" ? "🍬" :
              product.category === "Handicrafts" ? "🏺" : "📱"
            }</span>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-sm text-black/50 dark:text-white/50 mb-4">by {product.vendor}</p>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">{product.rating}</span>
              <span className="text-black/40 dark:text-white/40">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 my-6">
              <span className="text-4xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-black/40 dark:text-white/40 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <p className="text-black/70 dark:text-white/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">−</button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-center"
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-center"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/30">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">🚚 Free delivery across Bihar for orders above ₹500</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Estimated delivery: 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
