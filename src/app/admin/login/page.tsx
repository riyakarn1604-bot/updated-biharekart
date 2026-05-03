"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use NextAuth credentials provider — admin role enforced server-side
    const res = await signIn("email-password", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials.");
      return;
    }

    if (res?.ok) {
      // Verify admin role via session
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (sessionData?.user?.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        return;
      }
      router.replace("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
          🛕 Bihar Bazaar
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="text-xl font-black">Admin Login</h1>
          <p className="text-xs opacity-50 mt-1">Restricted access — admins only</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-zinc-800 transition"
              placeholder="admin@biharbazaar.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-zinc-800 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm rounded-lg border border-amber-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-black/50 dark:text-white/50 mt-4">
          <Link href="/login" className="text-amber-600 hover:underline">← Back to user login</Link>
        </p>
      </div>
    </div>
  );
}
