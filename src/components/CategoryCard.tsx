"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { products, type Product } from "@/data/products";

const categoryEmoji: Record<string, string> = {
  "Mithila Art": "🎨",
  Handlooms: "🧵",
  Spices: "🌶️",
  Sweets: "🍬",
  Handicrafts: "🏺",
  Electronics: "📱",
};

export default function CategoryCard({
  name,
  icon,
  index = 0,
  isInView = true,
}: {
  name: string;
  icon: string;
  index?: number;
  isInView?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Get products for this category
  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === name),
    [name]
  );

  // Auto-cycle through products
  useEffect(() => {
    if (categoryProducts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categoryProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categoryProducts.length]);

  const currentProduct = categoryProducts[activeIndex];
  const productCount = categoryProducts.length;

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(name)}`}
      className={`
        group relative block rounded-2xl overflow-hidden aspect-[4/5]
        border border-black/5 dark:border-white/5
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)]
        hover:-translate-y-2
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        cursor-pointer
        ${isInView ? "animate-fade-in-up" : "opacity-0"}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Cycling product backgrounds */}
      {categoryProducts.map((product, i) => (
        <div
          key={product.id}
          className={`
            absolute inset-0 transition-all duration-700 ease-in-out
            ${product.image}
            ${i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"}
          `}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500" />

      {/* Cycling product emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
          {categoryEmoji[name] || "📦"}
        </span>
      </div>

      {/* Product name cycling through */}
      {currentProduct && (
        <div className="absolute top-3 left-3 right-3">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-lg px-3 py-1.5 inline-block">
            <p className="text-white text-[10px] font-medium truncate max-w-full">
              {currentProduct.name}
            </p>
          </div>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Dots indicator */}
        <div className="flex gap-1 mb-3">
          {categoryProducts.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex % Math.min(categoryProducts.length, 5)
                  ? "bg-white w-4"
                  : "bg-white/30 w-1.5"
              }`}
            />
          ))}
        </div>

        {/* Category info */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-white font-bold text-sm leading-tight">{name}</h3>
        </div>
      </div>

      {/* Hover shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </Link>
  );
}
