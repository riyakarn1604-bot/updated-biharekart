"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    ...(user?.role === "seller" || user?.role === "admin" ? [{ href: "/seller", label: "Sell" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl saturate-[1.8] border-b border-black/5 dark:border-white/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-xl tracking-tighter bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hover:opacity-85 transition-opacity"
        >
          <span className="text-2xl [filter:none]">🛕</span>
          Bihar Bazaar
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex ml-10 gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 text-foreground/70 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} suppressHydrationWarning>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1 animate-scale-in" suppressHydrationWarning>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {user ? (
            /* ── Logged-in: Profile Dropdown ── */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center border-2 border-primary/30 shadow-sm">
                  {initials}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">{user.name}</span>
                <svg
                  className={`w-3.5 h-3.5 text-black/40 dark:text-white/40 transition-transform duration-200 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-black/8 dark:border-white/8 overflow-hidden z-50 animate-fade-in-down">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-black/40 dark:text-white/40 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          user.role === "admin" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                          user.role === "seller" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}>
                          {user.role === "admin" ? "👑 Admin" : user.role === "seller" ? "🏪 Seller" : "🛒 Customer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link href="/orders" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <span>📦</span> My Orders
                    </Link>
                    {(user.role === "seller" || user.role === "admin") && (
                      <Link href="/seller" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span>🏪</span> Seller Dashboard
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-black/5 dark:border-white/5 py-1">
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged in ── */
            <div className="flex items-center gap-2">
              <Link href="/seller" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors hidden md:block">
                Sell
              </Link>
              <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors hidden sm:block">
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center py-2 px-5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/5 bg-background/95 backdrop-blur-xl animate-fade-in-down">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/orders" className="py-2.5 px-3 rounded-xl font-medium hover:bg-black/5 transition-colors" onClick={() => setMobileOpen(false)}>📦 My Orders</Link>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="py-2.5 px-3 rounded-xl text-left text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2.5 px-3 rounded-xl font-medium hover:bg-black/5 transition-colors" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="py-2.5 px-3 rounded-xl font-medium hover:bg-black/5 transition-colors" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
