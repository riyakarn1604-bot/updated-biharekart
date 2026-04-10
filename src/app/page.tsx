"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="flex-shrink-0 px-4 md:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Empowering Local Sellers, <br />
              <span className="text-primary">Serving Bihar.</span>
            </h1>
            <p className="text-lg sm:text-xl text-black/60 dark:text-white/60 max-w-xl mb-10 leading-relaxed">
              Welcome to Bihar eKart. The platform connecting local vendors and small businesses to customers across the state with faster and cost-effective delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/shop"
                className="flex h-14 items-center justify-center rounded-full bg-primary px-8 text-primary-foreground font-semibold hover:scale-105 transition-transform"
              >
                Start Shopping
              </Link>
              <Link
                href="/seller"
                className="flex h-14 items-center justify-center rounded-full border border-black/10 dark:border-white/10 px-8 font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm aspect-square rounded-full bg-gradient-to-tr from-primary/30 to-primary/5 blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-black/60 dark:text-white/60 mt-2">Discover authentic local products</p>
          </div>
          <Link href="/shop" className="text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.03] transition-transform border border-black/5 dark:border-white/5 opacity-90 hover:opacity-100`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold text-sm text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-black/60 dark:text-white/60 mt-2">Handpicked items celebrating our culture</p>
          </div>
          <Link href="/shop" className="text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
