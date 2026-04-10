"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col gap-3">
      <Link href={`/product/${product.id}`}>
        <div className={`w-full aspect-square rounded-2xl ${product.image} overflow-hidden relative cursor-pointer`}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
            <span className="text-5xl opacity-30">{
              product.category === "Mithila Art" ? "🎨" :
              product.category === "Handlooms" ? "🧵" :
              product.category === "Spices" ? "🌶️" :
              product.category === "Sweets" ? "🍬" :
              product.category === "Handicrafts" ? "🏺" : "📱"
            }</span>
          </div>
        </div>
      </Link>
      <div>
        <div className="text-xs text-black/50 dark:text-white/50 mb-1 font-medium">{product.vendor}</div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold leading-tight text-base mb-1 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-black/40 dark:text-white/40 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50 mb-3">
          <span className="text-yellow-500">★</span> {product.rating} ({product.reviews})
        </div>
        <button
          onClick={() => addToCart(product)}
          className="w-full py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
