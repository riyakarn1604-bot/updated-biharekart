"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  items: { name: string; price: number; quantity: number; image?: string }[];
  total: number;
  address: Address;
  date: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, role: "customer" | "seller") => { success: boolean; error?: string };
  logout: () => void;
  addresses: Address[];
  addAddress: (addr: Address) => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-built demo accounts for presentation
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "admin@demo.com": { password: "admin123", user: { name: "Demo Admin", email: "admin@demo.com", role: "admin" } },
  "seller@demo.com": { password: "seller123", user: { name: "Demo Seller", email: "seller@demo.com", role: "seller" } },
  "user@demo.com": { password: "user123", user: { name: "Demo Customer", email: "user@demo.com", role: "customer" } },
  "admin@biharbazaar.com": { password: "password123", user: { name: "Admin", email: "admin@biharbazaar.com", role: "admin" } },
  "seller@biharbazaar.com": { password: "password123", user: { name: "Bihar Bazaar Seller", email: "seller@biharbazaar.com", role: "seller" } },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { data: session, status } = useSession();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const u = localStorage.getItem("ekart-user");
      const a = localStorage.getItem("ekart-addresses");
      const o = localStorage.getItem("ekart-orders");
      if (u) setUser(JSON.parse(u));
      if (a) setAddresses(JSON.parse(a));
      if (o) setOrders(JSON.parse(o));
    } catch {}
    setLoaded(true);
  }, []);

  // Sync with NextAuth session
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (session.user as any).role || "customer",
      });
    } else if (status === "unauthenticated") {
      // Only clear if the user was a NextAuth user (has a long cuid/id) 
      // or if they're not a demo user.
      setUser(prev => {
        if (!prev) return null;
        // Demo users have specific emails we know
        const isDemo = Object.values(DEMO_ACCOUNTS).some(d => d.user.email.toLowerCase() === prev.email.toLowerCase());
        if (isDemo) return prev; 
        // If they had an ID and status is unauthenticated, they're logged out of NextAuth
        return prev.id ? null : prev;
      });
    }
  }, [session, status]);

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    if (user) localStorage.setItem("ekart-user", JSON.stringify(user));
    else localStorage.removeItem("ekart-user");
    localStorage.setItem("ekart-addresses", JSON.stringify(addresses));
    localStorage.setItem("ekart-orders", JSON.stringify(orders));
  }, [user, addresses, orders, loaded]);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const lower = email.toLowerCase().trim();
    
    // Support shorthands: "admin" -> "admin@demo.com", etc.
    let targetEmail = lower;
    if (lower === "admin") targetEmail = "admin@demo.com";
    if (lower === "seller") targetEmail = "seller@demo.com";
    if (lower === "user") targetEmail = "user@demo.com";

    // Check demo accounts first
    const demo = DEMO_ACCOUNTS[targetEmail];
    if (demo && demo.password === password) {
      setUser(demo.user);
      return { success: true };
    }

    // Check registered users from localStorage
    try {
      const registered = JSON.parse(localStorage.getItem("ekart-registered-users") || "{}");
      if (registered[targetEmail]) {
        const storedUser = registered[targetEmail].user || registered[targetEmail];
        setUser(storedUser);
        return { success: true };
      }
    } catch {}

    return { success: false, error: "Incorrect email or password." };
  };

  const register = (name: string, email: string, password: string, role: "customer" | "seller"): { success: boolean; error?: string } => {
    const lower = email.toLowerCase().trim();

    // Check if already exists
    if (DEMO_ACCOUNTS[lower]) {
      return { success: false, error: "An account with this email already exists." };
    }

    try {
      const registered = JSON.parse(localStorage.getItem("ekart-registered-users") || "{}");
      if (registered[lower]) {
        return { success: false, error: "An account with this email already exists." };
      }

      // Save to localStorage without password
      const newUser: User = { name, email: lower, role };
      registered[lower] = newUser;
      localStorage.setItem("ekart-registered-users", JSON.stringify(registered));

      // Auto-login
      setUser(newUser);
      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong." };
    }
  };

  const logout = () => {
    setUser(null);
    nextAuthSignOut({ redirect: true, callbackUrl: "/login" });
  };

  const addAddress = (addr: Address) => {
    setAddresses((prev) => [...prev, addr]);
  };

  const placeOrder = (order: Omit<Order, "id" | "date" | "status">): string => {
    const id = "ORD-" + Date.now().toString(36).toUpperCase();
    const newOrder: Order = {
      ...order,
      id,
      date: new Date().toISOString(),
      status: "Processing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return id;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, addresses, addAddress, orders, placeOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
