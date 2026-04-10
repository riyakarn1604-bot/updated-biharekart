"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface SellerProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "Active" | "Draft";
}

export default function SellerPage() {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<SellerProduct[]>([
    { id: 1, name: "Sample Product", price: 499, category: "Handicrafts", stock: 25, status: "Active" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Mithila Art", stock: "" });

  if (!user) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🏪</span>
          <h1 className="text-2xl font-bold mb-2">Become a Seller on Bihar eKart</h1>
          <p className="text-black/50 dark:text-white/50 mb-6 max-w-md text-center">
            Register as a seller to list your products and reach thousands of customers across Bihar.
          </p>
          <Link href="/register" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90">
            Register as Seller
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    const prod: SellerProduct = {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      stock: Number(newProduct.stock),
      status: "Active",
    };
    setMyProducts((prev) => [...prev, prod]);
    setNewProduct({ name: "", price: "", category: "Mithila Art", stock: "" });
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    setMyProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStatus = (id: number) => {
    setMyProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p))
    );
  };

  const totalRevenue = myProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-black/50 dark:text-white/50">Welcome, {user.name}</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Total Products</p>
            <p className="text-3xl font-bold">{myProducts.length}</p>
          </div>
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-green-600">{myProducts.filter((p) => p.status === "Active").length}</p>
          </div>
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Inventory Value</p>
            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="p-6 border border-primary/20 bg-primary/5 rounded-2xl mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input placeholder="Price (₹)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Mithila Art</option>
                <option>Handlooms</option>
                <option>Spices</option>
                <option>Sweets</option>
                <option>Handicrafts</option>
                <option>Electronics</option>
              </select>
              <input placeholder="Stock Quantity" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={handleAdd} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Add Product
            </button>
          </div>
        )}

        {/* Product Table */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/[.02] dark:bg-white/[.02] text-left">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.id} className="border-t border-black/5 dark:border-white/5">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-black/60 dark:text-white/60">{product.category}</td>
                    <td className="px-6 py-4">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(product.id)} className="text-primary text-xs hover:underline">
                          {product.status === "Active" ? "Pause" : "Activate"}
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 text-xs hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
