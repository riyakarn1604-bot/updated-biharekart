"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  role: "customer" | "seller";
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
  items: { name: string; price: number; quantity: number }[];
  total: number;
  address: Address;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: "customer" | "seller") => boolean;
  logout: () => void;
  addresses: Address[];
  addAddress: (addr: Address) => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    if (!loaded) return;
    if (user) localStorage.setItem("ekart-user", JSON.stringify(user));
    else localStorage.removeItem("ekart-user");
    localStorage.setItem("ekart-addresses", JSON.stringify(addresses));
    localStorage.setItem("ekart-orders", JSON.stringify(orders));
  }, [user, addresses, orders, loaded]);

  const login = (email: string, _password: string): boolean => {
    // Mock login — accept any credentials
    setUser({ name: email.split("@")[0], email, role: "customer" });
    return true;
  };

  const register = (name: string, email: string, _password: string, role: "customer" | "seller"): boolean => {
    setUser({ name, email, role });
    return true;
  };

  const logout = () => {
    setUser(null);
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
