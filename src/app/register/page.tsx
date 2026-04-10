"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    const success = register(name, email, password, role);
    if (success) router.push("/");
    else setError("Registration failed.");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 border border-black/5 dark:border-white/5 rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div>
              <p className="text-sm font-medium mb-2">I want to:</p>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${role === "customer" ? "border-primary bg-primary/5 text-primary" : "border-black/10 dark:border-white/10"}`}>
                  <input type="radio" name="role" value="customer" checked={role === "customer"} onChange={() => setRole("customer")} className="accent-primary" />
                  🛒 Buy
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${role === "seller" ? "border-primary bg-primary/5 text-primary" : "border-black/10 dark:border-white/10"}`}>
                  <input type="radio" name="role" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} className="accent-primary" />
                  🏪 Sell
                </label>
              </div>
            </div>
            <button type="submit" className="py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Create Account
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-black/50 dark:text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
