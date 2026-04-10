"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill both fields.");
      return;
    }
    const success = login(email, password);
    if (success) router.push("/");
    else setError("Login failed. Try again.");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 border border-black/5 dark:border-white/5 rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to Bihar eKart</h1>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <button type="submit" className="py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Login
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-black/50 dark:text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
