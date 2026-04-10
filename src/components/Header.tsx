"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
          Bihar eKart
        </Link>
        <nav className="hidden md:flex ml-8 gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/seller" className="hover:text-primary transition-colors">Sell</Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/cart" className="relative hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                Orders
              </Link>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
