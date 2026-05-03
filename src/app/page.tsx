"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/products";

// ===== INTERSECTION OBSERVER =====
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isInView };
}

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} suppressHydrationWarning>{count.toLocaleString()}{suffix}</span>;
}

// ===== DATA =====
const floatingIcons = [
  { emoji: "🎨", top: "10%", left: "5%", delay: "0s", dur: "7s" },
  { emoji: "🧵", top: "20%", right: "8%", delay: "1s", dur: "9s" },
  { emoji: "🌶️", top: "60%", left: "3%", delay: "2s", dur: "8s" },
  { emoji: "🍬", top: "45%", right: "5%", delay: "0.5s", dur: "10s" },
  { emoji: "🏺", bottom: "15%", left: "10%", delay: "3s", dur: "7.5s" },
  { emoji: "📱", bottom: "20%", right: "12%", delay: "1.5s", dur: "8.5s" },
];

const testimonials = [
  { name: "Priya Sharma", location: "Patna, Bihar", text: "Bihar Bazaar brought the authentic taste of Silao Khaja right to my doorstep in Delhi. It tastes exactly like the one from my childhood!", avatar: "PS", rating: 5 },
  { name: "Rajesh Kumar", location: "Mumbai, Maharashtra", text: "The Madhubani paintings I ordered are absolutely breathtaking. Each piece is a masterpiece that tells a story of Bihar's rich cultural heritage.", avatar: "RK", rating: 5 },
  { name: "Anita Devi", location: "Bhagalpur, Bihar", text: "As a weaver, this platform has changed my life. I can now sell my Bhagalpuri silk sarees to customers across India directly!", avatar: "AD", rating: 5 },
];

const features = [
  { icon: "🚀", title: "Express Delivery", desc: "Fast doorstep delivery across Bihar and pan-India within 3-5 business days." },
  { icon: "🛡️", title: "Authentic Products", desc: "Every product is verified for authenticity. GI-tagged and certified goods only." },
  { icon: "💰", title: "Best Prices", desc: "Direct from artisans — no middlemen. Get fair prices supporting local communities." },
  { icon: "🔄", title: "Easy Returns", desc: "Hassle-free 7-day return policy. Your satisfaction is our top priority." },
];

const marqueeItems = [
  "🎨 Madhubani Art", "🧵 Bhagalpuri Silk", "🌶️ Bihar Spices", "🍬 Silao Khaja",
  "🏺 Sikki Grass Craft", "🪷 Mithila Heritage", "🛕 Nalanda Sweets", "📱 Local Electronics",
  "🫘 Mithila Makhana", "🍚 Katarni Rice", "🪵 Wood Carvings", "🎭 Folk Art",
];

export default function Home() {
  const hero = useInView();
  const cats = useInView();
  const featured = useInView();
  const whyUs = useInView();
  const reviews = useInView();
  const newsletter = useInView();
  const stats = useInView();

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const mapped = data.map((p: any) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || "[]") : []),
        }));
        setFeaturedProducts(mapped.slice(0, 8));
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/50 to-purple-50/40 dark:from-[#0d0b08] dark:via-[#0a0a0f] dark:to-[#0c0816]">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 opacity-[0.15] dark:opacity-[0.06] blur-[80px] animate-morph" />
          <div className="absolute -bottom-36 -left-24 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-400 to-pink-400 opacity-[0.12] dark:opacity-[0.05] blur-[80px] animate-morph [animation-delay:-3s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-emerald-300 to-sky-300 opacity-[0.08] dark:opacity-[0.03] blur-[80px] animate-morph [animation-delay:-6s]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingIcons.map((ic, i) => (
            <span
              key={i}
              className="absolute text-[2rem] opacity-[0.07] dark:opacity-[0.04] animate-float"
              style={{ ...ic, animationDelay: ic.delay, animationDuration: ic.dur } as React.CSSProperties}
            >
              {ic.emoji}
            </span>
          ))}
        </div>

        <div ref={hero.ref} className="relative z-10 px-4 md:px-8 py-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className={`flex flex-col items-center lg:items-start text-center lg:text-left ${hero.isInView ? "" : "opacity-0"}`}>
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-4 ${hero.isInView ? "animate-fade-in-up" : ""}`}>
                <span>🛕</span> Bihar&apos;s #1 Marketplace
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05] ${hero.isInView ? "animate-fade-in-up [animation-delay:100ms]" : ""}`}>
                Empowering Local
                <br />
                Sellers,{" "}
                <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-[length:300%_300%] bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]" style={{ backgroundSize: "300% 300%", animation: "none" }}>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Serving Bihar.</span>
                </span>
              </h1>

              <p className={`text-lg sm:text-xl opacity-55 max-w-xl mb-10 leading-relaxed ${hero.isInView ? "animate-fade-in-up [animation-delay:200ms]" : ""}`}>
                Discover authentic Bihari products — from Madhubani art to Bhagalpuri silk.
                Connecting artisans directly to your doorstep with love & trust.
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${hero.isInView ? "animate-fade-in-up [animation-delay:300ms]" : ""}`}>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 text-[15px] font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                  Start Shopping
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link
                  href="/seller-register"
                  className="inline-flex items-center justify-center h-14 px-8 text-[15px] font-semibold rounded-full border-[1.5px] border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
                >
                  Become a Seller
                </Link>
              </div>

              <div className={`flex items-center gap-6 mt-10 text-sm opacity-40 ${hero.isInView ? "animate-fade-in-up [animation-delay:400ms]" : ""}`}>
                <span>✓ Free Shipping</span>
                <span>✓ Authentic Products</span>
                <span>✓ Easy Returns</span>
              </div>
            </div>

            {/* Right — orbiting visual */}
            <div className={`hidden lg:flex justify-center ${hero.isInView ? "animate-fade-in-right [animation-delay:300ms]" : "opacity-0"}`}>
              <div className="relative w-[420px] h-[420px]">
                <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-dashed border-accent/15 animate-spin-slow [animation-direction:reverse] [animation-duration:25s]" />
                <div className="absolute inset-12 animate-morph bg-gradient-to-tr from-primary/20 via-accent/10 to-primary-light/20" />
                {["🎨","🧵","🌶️","🍬","🏺","📱"].map((emoji, i) => (
                  <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDelay: `${-i * 5}s` }}>
                    <span className="text-3xl block animate-spin-slow" style={{ animationDelay: `${-i * 5}s` }}>{emoji}</span>
                  </div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-1">BB</div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-35">Bihar Bazaar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="py-4 border-y border-black/5 dark:border-white/5">
        <div className="relative overflow-hidden whitespace-nowrap before:absolute before:inset-y-0 before:left-0 before:w-24 before:bg-gradient-to-r before:from-background before:to-transparent before:z-10 after:absolute after:inset-y-0 after:right-0 after:w-24 after:bg-gradient-to-l after:from-background after:to-transparent after:z-10">
          <div className="inline-flex animate-marquee hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="inline-flex items-center px-6 text-sm font-medium opacity-40 whitespace-nowrap">
                {item}
                <span className="ml-6 text-primary/30">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={stats.ref} className="px-4 md:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className={`flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/20 ${stats.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          {[
            { n: 50000, s: "+", l: "Happy Customers" },
            { n: 2500, s: "+", l: "Products Listed" },
            { n: 500, s: "+", l: "Local Sellers" },
            { n: 38, s: "", l: "Bihar Districts" },
          ].map((st, i) => (
            <div key={st.l} className={`flex-1 py-5 px-6 text-center text-white ${i > 0 ? "border-l border-white/10" : ""} hover:bg-white/10 transition-colors`}>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none mb-1">
                <AnimatedCounter target={st.n} suffix={st.s} />
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider opacity-75">{st.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES (PRODUCT IMAGE ROLLOVERS) ===== */}
      <section ref={cats.ref} className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`flex justify-between items-end mb-10 ${cats.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative pb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>🗂️</span> Browse Categories
            </div>
            <h2 className="text-3xl font-black tracking-tight">Shop by Category</h2>
            <p className="opacity-45 mt-2 text-sm">Discover authentic local products from Bihar</p>
            <div className="absolute bottom-0 left-0 w-14 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <Link href="/shop" className="text-primary font-semibold text-sm hover:underline underline-offset-4 transition-all hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} name={cat.name} icon={cat.icon} index={i} isInView={cats.isInView} />
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section ref={featured.ref} className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`flex justify-between items-end mb-10 ${featured.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative pb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>⭐</span> Top Picks
            </div>
            <h2 className="text-3xl font-black tracking-tight">Featured Products</h2>
            <p className="opacity-45 mt-2 text-sm">Handpicked items celebrating Bihar&apos;s rich culture</p>
            <div className="absolute bottom-0 left-0 w-14 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <Link href="/shop" className="text-primary font-semibold text-sm hover:underline underline-offset-4 transition-all hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((p, i) => (
            <div key={p.id} className={featured.isInView ? "animate-fade-in-up" : "opacity-0"} style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {featuredProducts.slice(4, 8).map((p, i) => (
            <div key={p.id} className={featured.isInView ? "animate-fade-in-up" : "opacity-0"} style={{ animationDelay: `${(i + 4) * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className={`text-center mt-10 ${featured.isInView ? "animate-fade-in-up [animation-delay:600ms]" : "opacity-0"}`}>
          <Link href="/shop" className="inline-flex items-center justify-center h-12 px-8 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300">
            Browse All Products →
          </Link>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section ref={whyUs.ref} className="py-20 px-4 md:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className={`text-center mb-14 ${whyUs.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>💎</span> Why Bihar Bazaar
            </div>
            <h2 className="text-3xl font-black tracking-tight mt-1">Built for Bihar, Loved by India</h2>
            <p className="opacity-45 mt-3 max-w-lg mx-auto text-sm">
              We&apos;re more than a marketplace — we&apos;re a movement to put Bihar&apos;s incredible products on the national stage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`relative p-7 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 hover:before:opacity-100 before:transition-opacity ${whyUs.isInView ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-13 h-13 rounded-[14px] bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm opacity-55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section ref={reviews.ref} className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`text-center mb-14 ${reviews.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
            <span>💬</span> Customer Stories
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-1">Loved by Thousands</h2>
          <p className="opacity-45 mt-3 max-w-lg mx-auto text-sm">
            Real stories from real customers who discovered Bihar&apos;s treasures through our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative p-7 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-400 ${reviews.isInView ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="absolute top-4 right-6 text-5xl font-serif text-primary/10 leading-none select-none">&ldquo;</span>
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed opacity-65 mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="review-avatar">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs opacity-45">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🔒", title: "Secure Payments", desc: "100% secure checkout" },
            { icon: "📦", title: "Pan-India Shipping", desc: "We deliver everywhere" },
            { icon: "🏷️", title: "GI Tagged Products", desc: "Certified authentic" },
            { icon: "💚", title: "Support Local", desc: "Empowering Bihar" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-xl shrink-0">{b.icon}</div>
              <div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs opacity-45">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section ref={newsletter.ref} className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent p-10 sm:p-12 text-white ${newsletter.isInView ? "animate-scale-in" : "opacity-0"}`}>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Stay in the Loop</h2>
            <p className="opacity-75 mb-8 text-sm sm:text-base">
              Get exclusive deals, new product alerts, and stories from Bihar&apos;s artisan communities.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email..."
                suppressHydrationWarning
                className="flex-1 px-5 py-3.5 rounded-xl border-[1.5px] border-white/20 bg-white/10 backdrop-blur-sm text-white text-[15px] placeholder:text-white/50 outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
              <button 
                type="submit" 
                suppressHydrationWarning
                className="px-7 py-3.5 rounded-xl bg-white text-primary-dark font-bold text-[15px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe ✨
              </button>
            </form>
            <p className="text-xs opacity-45 mt-4">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
