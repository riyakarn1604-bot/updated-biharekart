"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
